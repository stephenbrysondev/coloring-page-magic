import { useState, useEffect } from 'react';
import { Box, Button, Input, Image, VStack, Text, useToast, Select, Alert, AlertIcon, Container } from '@chakra-ui/react';
import { generateImage } from '../services/openai';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { PricingModal } from './PricingModal';

type Complexity = 'simple' | 'medium' | 'detailed';

interface UserTier {
    is_premium: boolean;
    images_generated: number;
}

const FREE_TIER_LIMIT = 5;

export function ImageGenerator() {
    const [prompt, setPrompt] = useState('');
    const [complexity, setComplexity] = useState<Complexity>('simple');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [userTier, setUserTier] = useState<UserTier | null>(null);
    const { user } = useAuth();
    const toast = useToast();
    const [isPricingOpen, setIsPricingOpen] = useState(false);

    useEffect(() => {
        if (user) {
            fetchUserTier();
        }
    }, [user]);

    const fetchUserTier = async () => {
        const { data, error } = await supabase
            .from('user_tiers')
            .select('is_premium, images_generated')
            .eq('user_id', user?.id)
            .single();

        if (error) {
            console.error('Error fetching user tier:', error);
            return;
        }

        setUserTier(data);
    };


    const getPromptByComplexity = (basePrompt: string, complexity: Complexity) => {
        const prompts = {
            simple: `A very simple, preschool-level black and white line drawing for a kids coloring book of: ${basePrompt}. Use extra thick outlines, very minimal details, large basic shapes, no shading, no textures, suitable for ages 3-5.`,
            medium: `A child-friendly black and white line drawing for a kids coloring book of: ${basePrompt}. Use clear outlines, moderate details, simple shapes, no shading, suitable for ages 6-8.`,
            detailed: `An engaging black and white line drawing for a coloring book of: ${basePrompt}. Include interesting details while maintaining clear outlines, no complex shading, suitable for ages 9+.`
        };
        return prompts[complexity];
    };

    console.log('userTier', userTier, userTier?.images_generated, userTier?.is_premium);

    const handleGenerate = async () => {
        if (!prompt) return;

        // Show pricing modal only if user has hit the limit
        if (userTier && !userTier.is_premium && userTier.images_generated >= FREE_TIER_LIMIT) {
            setIsPricingOpen(true);
            return;
        }

        // Otherwise, proceed with image generation
        setLoading(true);
        try {
            const coloringPagePrompt = getPromptByComplexity(prompt, complexity);
            const imageUrl = await generateImage(coloringPagePrompt);
            setGeneratedImage(imageUrl);

            if (user) {
                // Update generated images count
                const { error: updateError } = await supabase
                    .from('user_tiers')
                    .update({
                        images_generated: (userTier?.images_generated || 0) + 1,
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', user.id);

                if (updateError) throw updateError;

                // Save the generated image
                const { error: insertError } = await supabase
                    .from('generated_images')
                    .insert([{
                        user_id: user.id,
                        prompt,
                        image_url: imageUrl,
                    }]);

                if (insertError) throw insertError;

                // Refresh user tier data
                await fetchUserTier();
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to generate image',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxW='2xl' centerContent>

            <VStack spacing={4} align="stretch" p={4}>
                {userTier && !userTier.is_premium && (
                    <Alert status={userTier.images_generated >= FREE_TIER_LIMIT ? 'warning' : 'info'}>
                        <AlertIcon />
                        {userTier.images_generated >= FREE_TIER_LIMIT
                            ? 'You have reached the free tier limit. Please upgrade to premium to generate more images.'
                            : `You have ${FREE_TIER_LIMIT - userTier.images_generated} free generations remaining.`
                        }
                    </Alert>
                )}
                <Input
                    placeholder="What would you like to color? (e.g., 'a happy elephant')"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <Select
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value as Complexity)}
                >
                    <option value="simple">Simple (Ages 3-5)</option>
                    <option value="medium">Medium (Ages 6-8)</option>
                    <option value="detailed">Detailed (Ages 9+)</option>
                </Select>
                <Button
                    onClick={handleGenerate}
                    isLoading={loading}
                    colorScheme="blue"
                >
                    Generate Coloring Page
                </Button>

                {generatedImage && (
                    <Box>
                        <Image src={generatedImage} alt="Generated coloring page" />
                        <Text mt={2} fontSize="sm" color="gray.500">
                            Prompt: {prompt}
                        </Text>
                    </Box>
                )}

                <PricingModal
                    isOpen={isPricingOpen}
                    onClose={() => setIsPricingOpen(false)}
                />
            </VStack>
        </Container>
    );
}
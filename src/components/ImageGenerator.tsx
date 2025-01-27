import { useState } from 'react';
import { Box, Button, Input, Image, VStack, Text, useToast } from '@chakra-ui/react';
import { generateImage } from '../services/openai';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function ImageGenerator() {
    const [prompt, setPrompt] = useState('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const toast = useToast();

    const handleGenerate = async () => {
        if (!prompt) return;

        setLoading(true);
        try {
            const imageUrl = await generateImage(prompt);
            setGeneratedImage(imageUrl);

            // Save to Supabase if user is authenticated
            if (user) {
                const { error } = await supabase
                    .from('generated_images')
                    .insert([
                        {
                            user_id: user.id,
                            prompt,
                            image_url: imageUrl,
                        },
                    ]);

                if (error) throw error;
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
        <VStack spacing={4} align="stretch" p={4}>
            <Input
                placeholder="Enter your image prompt..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />
            <Button
                onClick={handleGenerate}
                isLoading={loading}
                colorScheme="blue"
            >
                Generate Image
            </Button>

            {generatedImage && (
                <Box>
                    <Image src={generatedImage} alt="Generated image" />
                    <Text mt={2} fontSize="sm" color="gray.500">
                        Prompt: {prompt}
                    </Text>
                </Box>
            )}
        </VStack>
    );
} 
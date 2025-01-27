import { useEffect, useState } from 'react';
import { Grid, Image, Text, VStack } from '@chakra-ui/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface GeneratedImage {
    id: number;
    prompt: string;
    image_url: string;
    created_at: string;
}

export function ImageHistory() {
    const [images, setImages] = useState<GeneratedImage[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchImages();
        }
    }, [user]);

    const fetchImages = async () => {
        const { data, error } = await supabase
            .from('generated_images')
            .select('*')
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching images:', error);
            return;
        }

        setImages(data || []);
    };

    return (
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6} p={4}>
            {images.map((image) => (
                <VStack key={image.id} borderWidth={1} borderRadius="lg" p={4}>
                    <Image src={image.image_url} alt={image.prompt} />
                    <Text fontSize="sm">{image.prompt}</Text>
                    <Text fontSize="xs" color="gray.500">
                        {new Date(image.created_at).toLocaleDateString()}
                    </Text>
                </VStack>
            ))}
        </Grid>
    );
} 
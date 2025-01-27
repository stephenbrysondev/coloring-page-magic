import { Box, Flex, Button, Spacer, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function Navbar() {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        if (user) {
            fetchUserTier();
        }
    }, [user]);

    const fetchUserTier = async () => {
        const { data, error } = await supabase
            .from('user_tiers')
            .select('is_premium')
            .eq('user_id', user?.id)
            .single();

        if (!error && data) {
            setIsPremium(data.is_premium);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/auth');
    };

    return (
        <Box bg="gray.100" px={4} py={2}>
            <Flex alignItems="center">
                <Button variant="ghost" onClick={() => navigate('/')}>Generate</Button>
                <Button variant="ghost" onClick={() => navigate('/history')}>History</Button>
                <Spacer />
                <Text mr={4} fontSize="sm" color="gray.600">
                    {user?.email} ({isPremium ? 'Premium' : 'Free'})
                </Text>
                <Button onClick={handleSignOut}>Sign Out</Button>
            </Flex>
        </Box>
    );
} 
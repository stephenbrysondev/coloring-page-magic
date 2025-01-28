import { Box, Flex, Button, Spacer, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
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
            <Flex>
                <Button variant="ghost" onClick={() => navigate('/')}>Generate</Button>
                <Spacer />
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        {user?.email} ({isPremium ? 'Premium' : 'Free'})
                    </MenuButton>
                    <MenuList>
                        <MenuItem onClick={() => navigate('/history')}>History</MenuItem>
                        <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
        </Box>
    );
} 
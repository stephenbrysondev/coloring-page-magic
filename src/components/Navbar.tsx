import { Box, Flex, Button, Spacer } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
    const navigate = useNavigate();
    const { signOut } = useAuth();

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
                <Button onClick={handleSignOut}>Sign Out</Button>
            </Flex>
        </Box>
    );
} 
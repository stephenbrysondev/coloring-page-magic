import { useState } from 'react';
import { Box, Button, Input, VStack, Text, useToast } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signIn, signUp } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const handleAuth = async (action: 'signin' | 'signup') => {
        if (!email || !password) {
            toast({
                title: 'Error',
                description: 'Please fill in all fields',
                status: 'error',
                duration: 3000,
            });
            return;
        }

        setIsLoading(true);
        try {
            if (action === 'signin') {
                await signIn(email, password);
            } else {
                await signUp(email, password);
            }
            navigate('/');
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Authentication failed',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box maxW="400px" mx="auto" mt={8}>
            <VStack spacing={4}>
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    colorScheme="blue"
                    width="100%"
                    onClick={() => handleAuth('signin')}
                    isLoading={isLoading}
                >
                    Sign In
                </Button>
                <Button
                    width="100%"
                    onClick={() => handleAuth('signup')}
                    isLoading={isLoading}
                >
                    Sign Up
                </Button>
            </VStack>
        </Box>
    );
} 
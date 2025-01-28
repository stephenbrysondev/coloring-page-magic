import { useState } from 'react';
import { Button, Container, Input, VStack, Text, Box, Heading, useToast } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Auth() {
    const [isSignIn, setIsSignIn] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signIn, signUp } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const handleAuth = async (action: 'signin' | 'signup') => {
        if (action === 'signin' && (!email || !password)) {
            toast({
                title: 'Error',
                description: 'Please fill in all fields',
                status: 'error',
                duration: 3000,
            });
            return;
        }

        if (action === 'signup' && (!email || !password || !firstName || !lastName)) {
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
                // Here you could save firstName and lastName to a users table in Supabase
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
        <Box bg="gray.50" minH="100vh">
            <Container maxW="6xl" pt={20}>
                <VStack spacing={8} textAlign="center" mb={10}>
                    <Heading as="h1" size="2xl">
                        Kids Coloring Page Generator
                    </Heading>
                    <Text fontSize="xl" color="gray.600">
                        Create unique coloring pages for children of all ages using AI
                    </Text>
                </VStack>

                <Container maxW="md" bg="white" p={8} borderRadius="lg" boxShadow="lg">
                    <VStack spacing={4}>
                        <Heading as="h2" size="md" mb={2}>
                            {isSignIn ? 'Sign In' : 'Create an Account'}
                        </Heading>
                        {!isSignIn && (
                            <>
                                <Input
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    size="lg"
                                />
                                <Input
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    size="lg"
                                />
                            </>
                        )}
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            size="lg"
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            size="lg"
                        />
                        <Button
                            width="100%"
                            colorScheme="blue"
                            onClick={() => handleAuth(isSignIn ? 'signin' : 'signup')}
                            isLoading={isLoading}
                            size="lg"
                        >
                            {isSignIn ? 'Sign In' : 'Create Account'}
                        </Button>
                        <Text color="gray.500">or</Text>
                        <Button
                            variant="outline"
                            width="100%"
                            onClick={() => {
                                setIsSignIn(!isSignIn);
                                // Clear form when switching modes
                                if (isSignIn) {
                                    setFirstName('');
                                    setLastName('');
                                }
                            }}
                            size="lg"
                        >
                            {isSignIn ? 'Create a new account' : 'Already have an account'}
                        </Button>
                    </VStack>
                </Container>

                <VStack spacing={8} mt={16} textAlign="center">
                    <Heading as="h3" size="lg">
                        Features
                    </Heading>
                    <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={8} w="full">
                        <VStack p={6} bg="white" borderRadius="lg" boxShadow="md">
                            <Heading as="h4" size="md">
                                Age-Appropriate
                            </Heading>
                            <Text color="gray.600">
                                Choose complexity levels suitable for different age groups
                            </Text>
                        </VStack>
                        <VStack p={6} bg="white" borderRadius="lg" boxShadow="md">
                            <Heading as="h4" size="md">
                                Custom Designs
                            </Heading>
                            <Text color="gray.600">
                                Generate unique coloring pages from your descriptions
                            </Text>
                        </VStack>
                        <VStack p={6} bg="white" borderRadius="lg" boxShadow="md">
                            <Heading as="h4" size="md">
                                Save & Share
                            </Heading>
                            <Text color="gray.600">
                                Keep track of your favorite designs in your history
                            </Text>
                        </VStack>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
} 
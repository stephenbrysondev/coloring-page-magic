import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    VStack,
    Box,
    Text,
    useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleUpgrade = async (plan: 'monthly' | 'yearly') => {
        setLoading(true);
        try {
            toast({
                title: 'Coming Soon',
                description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan upgrade will be available soon!`,
                status: 'info',
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">Upgrade to Premium</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={6} pb={6}>
                        <Box
                            borderWidth={1}
                            borderRadius="lg"
                            p={6}
                            width="100%"
                            textAlign="center"
                        >
                            <Text fontSize="2xl" fontWeight="bold" mb={2}>
                                Monthly
                            </Text>
                            <Text fontSize="3xl" fontWeight="bold" mb={4}>
                                $9.99
                                <Text as="span" fontSize="sm" color="gray.500">
                                    /month
                                </Text>
                            </Text>
                            <VStack spacing={2} mb={4}>
                                <Text>✓ Unlimited generations</Text>
                                <Text>✓ Priority support</Text>
                                <Text>✓ Download in high resolution</Text>
                            </VStack>
                            <Button
                                colorScheme="blue"
                                width="100%"
                                onClick={() => handleUpgrade('monthly')}
                                isLoading={loading}
                            >
                                Choose Monthly
                            </Button>
                        </Box>

                        <Box
                            borderWidth={1}
                            borderRadius="lg"
                            p={6}
                            width="100%"
                            textAlign="center"
                            bg="blue.50"
                        >
                            <Text fontSize="2xl" fontWeight="bold" mb={2}>
                                Yearly
                            </Text>
                            <Text fontSize="3xl" fontWeight="bold" mb={4}>
                                $99.99
                                <Text as="span" fontSize="sm" color="gray.500">
                                    /year
                                </Text>
                            </Text>
                            <Text color="green.500" mb={4}>
                                Save 17%
                            </Text>
                            <VStack spacing={2} mb={4}>
                                <Text>✓ All monthly features</Text>
                                <Text>✓ 2 months free</Text>
                                <Text>✓ Bulk generation</Text>
                            </VStack>
                            <Button
                                colorScheme="blue"
                                width="100%"
                                variant="solid"
                                onClick={() => handleUpgrade('yearly')}
                                isLoading={loading}
                            >
                                Choose Yearly
                            </Button>
                        </Box>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
} 
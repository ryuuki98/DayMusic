import React, { useEffect, useState } from 'react';
import {
    Box,
    Text,
    VStack,
    Heading,
    HStack,
    Image,
    Button,
    Spinner,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';

const PublicBoardPosts = () => {
    const command = "search";
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/board/service`, {
                    method: 'GET',
                    body: JSON.stringify({
                        command: command,
                    }),
                    credentials: 'include',
                });
                console.log("response : " + response);
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }

                const data = await response.json();
                if (data.status !== 200) {
                    throw new Error('Failed to fetch posts');
                }

                setPosts(data.boardList);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <Box
            maxW="800px"
            mx="auto"
            p={4}
            borderWidth={1}
            borderRadius="lg"
            boxShadow="lg"
            bg="white"
        >
            <Heading mb={4} textColor="black">Public Posts</Heading>
            {error && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    {error}
                </Alert>
            )}
            {loading ? (
                <Spinner size="xl" />
            ) : (
                <VStack spacing={4}>
                    {posts.map((post) => (
                        <Box
                            key={post.board_code}
                            borderWidth={1}
                            borderRadius="lg"
                            boxShadow="md"
                            p={4}
                            w="full"
                            bg="gray.50"
                        >
                            <Text fontWeight="bold" textColor="black">
                                {post.contents}
                            </Text>
                            {post.music_code && (
                                <Text textColor="black">
                                    Music Code: {post.music_code}
                                </Text>
                            )}
                            <HStack justifyContent="space-between">
                                <Text textColor="gray.500">
                                    {post.is_public ? 'Public' : 'Private'}
                                </Text>
                                <Button colorScheme="purple" size="sm">Edit</Button>
                            </HStack>
                        </Box>
                    ))}
                </VStack>
            )}
        </Box>
    );
};

export default PublicBoardPosts;

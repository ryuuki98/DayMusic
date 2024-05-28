import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const command = "search";
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const myHeaders = new Headers();
    myHeaders.append('Content-Type','application/json;charset=utf-8');

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/board/service`, {
                    method: 'POST',
                    headers: myHeaders,
                    body: JSON.stringify({
                        command: command,
                    }),
                    credentials: 'include',
                });
                const responseText = await response.text();
                // console.log("Response Text: ", responseText);
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = JSON.parse(responseText);
                // const data = await response.json();
                // if (data.status !== 200) {
                //     throw new Error('Failed to fetch posts');
                // }

                setPosts(data.boardList);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleBoxClick = (boardCode) => {
        navigate('/board/detail', { state: { boardCode } });
    };

    return (
        <Box
            maxW="800px"
            mx="auto"
            p={4}
            borderWidth={1}
            borderRadius="lg"
            boxShadow="lg"
            bg="white"
            overflowY="auto"
            height="80vh"
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
                            cursor="pointer"
                            onClick={() => handleBoxClick(post.board_code)}
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
                            </HStack>
                        </Box>
                    ))}
                </VStack>
            )}
        </Box>
    );
};

export default PublicBoardPosts;

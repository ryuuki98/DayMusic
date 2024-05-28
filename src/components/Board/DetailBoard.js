import React, { useEffect, useState } from 'react';
import { useLocation  } from 'react-router-dom';
import {
    Box,
    Text,
    VStack,
    Heading,
    Spinner,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';


const BoardDetail = () => {
    const location = useLocation();
    const command = "detail";
    const { boardCode } = location.state || {};
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const myHeaders = new Headers();
    myHeaders.append('Content-Type','application/json;charset=utf-8');

    useEffect(() => {
        if (!boardCode) {
            setError('Board code not provided');
            return;
        }

        const fetchPost = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/board/service`, {
                    method: 'POST',
                    headers: myHeaders,
                    body: JSON.stringify({
                        command: command,
                        board_code: boardCode,
                    }),
                    credentials: 'include',
                });
                // const responseText = await response.text();
                console.log("Response: ", response.ok);
                if (!response.ok) {
                    throw new Error('Failed to fetch post');
                }

                const data = await response.json();
                setPost(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [boardCode]);

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
            {error && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    {error}
                </Alert>
            )}
            {loading ? (
                <Spinner size="xl" />
            ) : (
                post && (
                    <VStack spacing={4}>
                        <Heading textColor="black">Post Details</Heading>
                        <Text fontWeight="bold" textColor="black">
                            {post.contents}
                        </Text>
                        {post.music_code && (
                            <Text textColor="black">
                                Music Code: {post.music_code}
                            </Text>
                        )}
                        <Text textColor="gray.500">
                            {post.is_public ? 'Public' : 'Private'}
                        </Text>
                    </VStack>
                )
            )}
        </Box>
    );
};

export default BoardDetail;

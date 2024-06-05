import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Text,
    VStack,
    Heading,
    Alert,
    AlertIcon,
    Flex,
    Image,
} from '@chakra-ui/react';
import AuthContext from '../../context/AuthContext';

const UserMusicBoardPosts = ({ userId }) => {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const command = "myMusicBoard";
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json;charset=utf-8');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/board/service`, {
                    method: 'POST',
                    headers: myHeaders,
                    body: JSON.stringify({
                        id: userId,
                        command: command,
                    }),
                    credentials: 'include',
                });
                const responseText = await response.text();
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = JSON.parse(responseText);
                setPosts(data.boardList);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchPosts();
    }, [userId, command]);

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
            <Heading mb={4} textColor="black">Music Posts</Heading>
            {error && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    {error}
                </Alert>
            )}
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
                        <Flex justifyContent="space-between" alignItems="center">
                            <Text
                                fontWeight="bold"
                                textColor="black"
                                cursor="pointer"
                                onClick={() => handleBoxClick(post.board_code)}
                                flex="1"
                            >
                                {post.contents}
                                {post.music_track && (
                                <>
                                    <Image
                                        borderRadius="md"
                                        src={post.music_thumbnail}
                                        alt="Post image"
                                        mb={4}
                                        boxSize="100px" // 정사각형으로 만들기 위해 크기 고정
                                        objectFit="cover"
                                        style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }} // 이미지를 가운데 정렬하는 CSS 스타일 적용
                                    />
                                    <Text mb={2}>노래 제목: {post.music_track}</Text>
                                    <Text mb={2}>가수: {post.music_artist}</Text>
                                </>
                                )}
                            </Text>
                        </Flex>
                        {post.music_code && (
                            <Text textColor="black">
                                Music Code: {post.music_code}
                            </Text>
                        )}
                    </Box>
                ))}
            </VStack>
        </Box>
    );
};

export default UserMusicBoardPosts;

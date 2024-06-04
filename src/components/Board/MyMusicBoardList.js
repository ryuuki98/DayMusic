import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Text,
    VStack,
    Heading,
    Alert,
    AlertIcon,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    Flex,
} from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import AuthContext from '../../context/AuthContext';

const MyMusicBoardPosts = ({ onPostCountChange }) => { // onPostCountChange prop 추가
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
                        id: currentUser.id,
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
                onPostCountChange(data.boardList.length); // 게시글 수 설정
            } catch (error) {
                setError(error.message);
            }
        };

        fetchPosts();
    }, [currentUser.id, command]);

    const handleBoxClick = (boardCode) => {
        navigate('/board/detail', { state: { boardCode } });
    };

    const handleEdit = (boardCode) => {
        navigate('/board/update', { state: { boardCode } });
    };

    const handleDelete = async (boardCode) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/board/service`, {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({
                    command: "delete",
                    id: currentUser.id,
                    board_code: boardCode,
                }),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to delete post');
            }

            // Remove the deleted post from the list
            const updatedPosts = posts.filter(post => post.board_code !== boardCode);
            setPosts(updatedPosts);
            onPostCountChange(updatedPosts.length); // 게시글 수 업데이트
        } catch (error) {
            setError(error.message);
        }
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
            <Heading mb={4} textColor="black">My Posts</Heading>
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
                            </Text>
                            <Menu>
                                <MenuButton
                                    as={IconButton}
                                    aria-label="Options"
                                    icon={<BsThreeDotsVertical />}
                                    variant="ghost"
                                    ml="auto"
                                />
                                <MenuList>
                                    <MenuItem onClick={() => handleEdit(post.board_code)}>Edit</MenuItem>
                                    <MenuItem onClick={() => handleDelete(post.board_code)}>Delete</MenuItem>
                                </MenuList>
                            </Menu>
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

export default MyMusicBoardPosts;
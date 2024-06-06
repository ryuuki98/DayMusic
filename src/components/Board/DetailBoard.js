import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Text,
    VStack,
    Spinner,
    Alert,
    AlertIcon,
    Flex,
    Avatar,
    IconButton,
    Image,
    Button,
    HStack,
    useToast,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { BiChat, BiLike, BiShare } from 'react-icons/bi';
import AuthContext from '../../context/AuthContext';
import CommentList from '../Comment/CommentList';

const BoardDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const { boardCode } = location.state || {};
    const [post, setPost] = useState(null);
    const [error, setError] = useState('');
    const [profileImg, setProfileImg] = useState('');
    const [likeCount, setLikeCount] = useState(0);
    const [likeList, setLikeList] = useState([]);
    const [isHeaderVisible, setIsHeaderVisible] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const myHeaders = new Headers();
    const toast = useToast();
    myHeaders.append('Content-Type', 'application/json;charset=utf-8');

    const handleSubmit = (e) => {
        e.preventDefault();
        const board_code = post.board_code;
        const command = 'likeAdd';
        const id = currentUser.id;

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                command: command,
                id: id,
                board_code: board_code,
            }),
        };

        fetch(`${process.env.REACT_APP_SERVER_URL}/like`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                const count = data.count;
                if (data !== null) {
                    setLikeCount(count);
                    toast({
                        title: '좋아요가 반영되었습니다.',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    });
                } else {
                    toast({
                        title: '좋아요 처리 실패',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                }
            })
            .catch((error) => {
                toast({
                    title: '서버 요청 실패',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            });
    };

    const listSubmit = (e) => {
        e.preventDefault();
        setIsHeaderVisible((prevState) => !prevState);
        const board_code = post.board_code;

        fetch(`${process.env.REACT_APP_SERVER_URL}/like?command=like&board_code=${board_code}`, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((data) => {
                setLikeList(data);
            })
            .catch((error) => {
                console.log('요청 실패:', error);
            });
    };

    const handleEdit = (boardCode) => {
        navigate(`/board/update/`, { state: { boardCode } });
    };

    const handleDelete = async (boardCode) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/board/service`, {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({
                    command: 'delete',
                    id: currentUser.id,
                    board_code: boardCode,
                }),
                credentials: 'include',
            });

            const responseText = await response.text();
            let result;

            try {
                result = JSON.parse(responseText);
            } catch (e) {
                throw new Error('Invalid JSON response');
            }

            if (response.ok && result.status === 200) {
                setPosts(posts.filter((post) => post.board_code !== boardCode));
                toast({
                    title: '게시글이 삭제되었습니다.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                throw new Error(result.message || 'Failed to delete post');
            }
        } catch (error) {
            setError(error.message);
            toast({
                title: '게시글 삭제 실패',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    useEffect(() => {
        if (!boardCode) {
            setError('Board code not provided');
            return;
        }

        const fetchPost = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/board/service`, {
                    method: 'POST',
                    headers: myHeaders,
                    body: JSON.stringify({
                        command: 'detail',
                        board_code: boardCode,
                    }),
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch post');
                }

                const data = await response.json();
                setPost(data);
                setLikeCount(data.likeCount);
                fetch(`${process.env.REACT_APP_SERVER_URL}/image/service?userId=${data.id}`, {
                    method: 'GET',
                    credentials: 'include',
                })
                    .then((response) => response.json())
                    .then((imageData) => {
                        if (imageData.profileImageUrl) {
                            setProfileImg(imageData.profileImageUrl);
                        }
                    })
                    .catch((error) => {
                        console.error('Error fetching profile image:', error);
                    });
            } catch (error) {
                setError(error.message);
            }
        };

        fetchPost();
    }, [boardCode]);

    const handleAddComment = (newComment) => {
        setPost((prevPost) => ({
            ...prevPost,
            comments: [...(prevPost.comments || []), newComment],
            commentCount: (prevPost.commentCount || 0) + 1,
        }));
    };

    return (
        <Box maxW="800px" mx="auto" p={4} bg="white" boxShadow="md">
            {error && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    {error}
                </Alert>
            )}
            {post ? (
                <Box w="full" p={4} bg="white" boxShadow="md">
                    <Flex alignItems="center" mb={4}>
                        <Avatar size="md" name={post.nickname} src={profileImg || 'https://bit.ly/sage-adebayo'} />
                        <Box ml={3}>
                            <Text fontWeight="bold">{post.nickname}</Text>
                            <Text fontSize="sm" color="gray.500">
                                {new Date(post.createdAt).toLocaleString()}
                            </Text>
                        </Box>
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
                    <Text mb={4}>{post.contents}</Text>

                    
                    {post.imgPath && (
                        <Image
                        borderRadius="md"
                        src={post.imgPath}
                        alt="Post image"
                        mb={4}
                        boxSize="500px"
                        objectFit="cover"
                        style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                    />
                    )}
                        
                        {post.music_track && (
                            <Box mb={3} p={3} borderWidth="1px" borderRadius="lg" width="100%" bg="purple.50">
                            <HStack spacing={3}>
                                <Image
                                    src={post.music_Thumbnail}
                                    alt={`${post.music_track} thumbnail`}
                                    boxSize="75px"
                                    borderRadius="md"
                                />
                                <VStack align="start" spacing={1}>
                                    <Text fontWeight="bold" fontSize="md">
                                        {post.music_track}
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        {post.music_artist}
                                    </Text>
                                    <audio controls src={post.music_preview_url} style={{ width: '150px' }}></audio>
                                </VStack>
                            </HStack>
                        </Box>
                    )}


                    <HStack spacing={4}>
                        <Button
                            flex="1"
                            variant="ghost"
                            leftIcon={<BiLike />}
                            onClick={handleSubmit}
                            value={post.board_code}
                        >
                            <Text>{likeCount}</Text>
                            <Box as="span" mx="2"></Box>
                            Like
                        </Button>
                        <Button flex="1" variant="ghost" leftIcon={<BiLike />} onClick={listSubmit}>
                            Likelist
                        </Button>
                        <Button
                            flex="1"
                            variant="ghost"
                            leftIcon={<BiChat />}
                            onClick={() => setShowComments(!showComments)}
                        >
                            Comment {post.commentCount}
                        </Button>
                        <Button flex="1" variant="ghost" leftIcon={<BiShare />}>
                            Share
                        </Button>
                    </HStack>
                    {isHeaderVisible && (
                        <Box p={2} border="1px solid" borderColor="gray.200" borderRadius="md" w="full">
                            {likeList.map((list, index) => (
                                <HStack key={index} p={2} borderWidth={1} borderRadius="md" mb={2}>
                                    <Image
                                        borderRadius="full"
                                        boxSize="50px"
                                        src={list.profileImgUrl}
                                        alt={`${list.nickname}'s profile`}
                                        mr={4}
                                    />
                                    <Text>{list.nickname}</Text>
                                </HStack>
                            ))}
                        </Box>
                    )}
                    {showComments && (
                        <CommentList
                            boardCode={post.board_code}
                            onAddComment={(newComment) => handleAddComment(newComment)}
                            updateCommentCount={(count) => {
                                setPost((prevPost) => ({
                                    ...prevPost,
                                    commentCount: count,
                                }));
                            }}
                        />
                    )}
                </Box>
            ) : (
                <Spinner size="xl" />
            )}
        </Box>
    );
};

export default BoardDetail;
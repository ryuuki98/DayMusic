import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Text,
    VStack,
    Heading,
    HStack,
    Image,
    Alert,
    AlertIcon,
    Flex,
    Avatar,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useToast,
} from '@chakra-ui/react';
import { BiChat, BiLike, BiShare } from 'react-icons/bi';
import AuthContext from '../../context/AuthContext';
import { BsThreeDotsVertical } from 'react-icons/bs';
import CommentList from '../Comment/CommentList'; // 올바른 경로로 CommentList 임포트
import SideRankBar from '../Rank/SideRankBar';

const SearchBoard = () => {
    const navigate = useNavigate();
    const command = 'search';
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');
    const { currentUser } = useContext(AuthContext); // 로그인 정보 확인
    const [showComments, setShowComments] = useState({});
    const myHeaders = new Headers();
    const toast = useToast();

    myHeaders.append('Content-Type', 'application/json;charset=utf-8');

    const likeUpdate = (board_code, count) => {
        posts.map((post) => {
            if (post.board_code == board_code) {
                post.likeCount = count;
                setPosts([...posts]);
                return;
            }
        });
    };

    const handleSubmit = (e) => {
        // 좋아요 추가/제거 이벤트
        e.preventDefault();
        const board_code = e.target.value;
        const command = 'likeAdd';
        const id = currentUser.id;
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json;charset=utf-8');

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
            .then((response) => {
                return response.json().then((data) => {
                    const count = data.count;
                    if (response.ok) {
                        likeUpdate(board_code, count);
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
                });
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
                // Remove the deleted post from the list
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

    const toggleComments = (boardCode) => {
        setShowComments((prevState) => ({
            ...prevState,
            [boardCode]: !prevState[boardCode],
        }));
    };

    const handleNicknameClick = (id) => {
        navigate('/userFollow', { state: { postId: id } });
    };

    const handlePostClick = (boardCode) => {
        navigate('/board/detail', { state: { boardCode } });
    };

    const handleAddComment = (newComment, boardCode) => {
        setPosts(
            posts.map((post) => {
                if (post.board_code === boardCode) {
                    post.comments = [...(post.comments || []), newComment];
                }
                return post;
            })
        );
    };

    useEffect(() => {
        if (currentUser === null) {
            alert('로그인을 해야합니다.');
            navigate('/');
        } else {
            const fetchPosts = async () => {
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
                    if (!response.ok) {
                        throw new Error('Failed to fetch posts');
                    }
                    const data = JSON.parse(responseText);
                    setPosts(data.boardList);
                } catch (error) {
                    setError(error.message);
                    toast({
                        title: '게시글 조회 실패',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                }
            };

            fetchPosts();
        }
    }, []);

    return (
        <>
            <SideRankBar />
            <Box maxW="800px" mx="10%" p={4} bg="white" overflowY="auto" height="100vh" mr="250px">
                {error && (
                    <Alert status="error" mb={4}>
                        <AlertIcon />
                        {error}
                    </Alert>
                )}
                <VStack spacing={4}>
                    {posts.map((post) => (
                        <Box key={post.board_code} w="full" p={4} bg="white" boxShadow="md">
                            <Flex alignItems="center" mb={4}>
                                <Avatar size="md" name={post.nickname} src={post.profileImg} />
                                <Box ml={3} cursor="pointer" onClick={() => handleNicknameClick(post.id)}>
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
                            <Text mb={4} cursor="pointer" onClick={() => handlePostClick(post.board_code)}>
                                {post.contents}
                            </Text>
                            {post.image_url && (
                                <Image
                                    borderRadius="md"
                                    src={post.image_url}
                                    alt="Post image"
                                    mb={4}
                                    boxSize="500px" // 정사각형으로 만들기 위해 크기 고정
                                    objectFit="cover"
                                    style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }} // 이미지를 가운데 정렬하는 CSS 스타일 적용
                                />
                            )}

                            {post.music_track && (
                                <Box mb={3} p={3} borderWidth="1px" borderRadius="lg" width="100%" bg="purple.50">
                                    <HStack spacing={3}>
                                        <Image
                                            src={post.music_thumbnail}
                                            alt={`${post.music_track} thumbnail`}
                                            boxSize="75px"
                                            borderRadius="md"
                                        />
                                        <VStack align="start" spacing={1}>
                                            <Text fontWeight="bold" fontSize="md">
                                                노래 제목: {post.music_track}
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                가수: {post.music_artist}
                                            </Text>
                                            <audio
                                                controls
                                                src={post.music_preview_url}
                                                style={{ width: '150px' }}
                                            ></audio>
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
                                    <Text key={post.board_code} id={post.board_code}>
                                        {post.likeCount}
                                    </Text>
                                    <Box as="span" mx="2"></Box>
                                    Like
                                </Button>
                                <Button
                                    flex="1"
                                    variant="ghost"
                                    leftIcon={<BiChat />}
                                    onClick={() => toggleComments(post.board_code)}
                                >
                                    Comment {post.commentCount}
                                </Button>
                                <Button flex="1" variant="ghost" leftIcon={<BiShare />}>
                                    Share
                                </Button>
                            </HStack>
                            {showComments[post.board_code] && (
                                <CommentList
                                    boardCode={post.board_code}
                                    onAddComment={(newComment) => handleAddComment(newComment, post.board_code)}
                                />
                            )}
                        </Box>
                    ))}
                </VStack>
            </Box>
        </>
    );
};

export default SearchBoard;

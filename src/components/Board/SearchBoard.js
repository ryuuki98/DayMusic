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
} from '@chakra-ui/react';
import { BiChat, BiLike, BiShare } from 'react-icons/bi';
import AuthContext from '../../context/AuthContext';
import { BsThreeDotsVertical } from 'react-icons/bs';
import CommentList from '../Comment/CommentList.js';  // 올바른 경로로 CommentList 임포트

const SearchBoard = () => {
    const navigate = useNavigate();
    const command = "search";
    const [posts, setPosts] = useState([]); // 게시물 상태
    const [error, setError] = useState(''); // 에러 상태
    const { currentUser } = useContext(AuthContext); // 로그인 정보 확인
    const [showComments, setShowComments] = useState({}); // 댓글 표시 상태
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json;charset=utf-8');

    // 좋아요 상태를 토글하는 함수
    const handleLike = (postId) => {
        // 게시물 상태 업데이트
        setPosts(prevPosts => 
            prevPosts.map(post => 
                post.board_code === postId
                    ? { ...post, likeCount: post.likeCount + (post.likedByUser ? -1 : 1), likedByUser: !post.likedByUser }
                    : post
            )
        );

        // 좋아요 상태 서버에 업데이트
        const likeStatus = posts.find(post => post.board_code === postId).likedByUser;
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({ postId, likeStatus }),
        };

        fetch(`${process.env.REACT_APP_SERVER_URL}/like`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    console.error('Failed to update like status');
                }
            })
            .catch(error => {
                console.error('Error updating like status:', error);
            });
    };

    // 게시물 수정 핸들러
    const handleEdit = (boardCode) => {
        navigate(`/board/update/`, { state: { boardCode } });
    };

    // 게시물 삭제 핸들러
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

            if (!response.ok) {
                throw new Error('Failed to delete post');
            }

            // 삭제된 게시물 리스트에서 제거
            setPosts(posts.filter(post => post.board_code !== boardCode));
        } catch (error) {
            setError(error.message);
        }
    };

    // 댓글 표시 토글 핸들러
    const toggleComments = (boardCode) => {
        setShowComments(prevState => ({
            ...prevState,
            [boardCode]: !prevState[boardCode],
        }));
    };

    // 닉네임 클릭 핸들러
    const handleNicknameClick = (id) => {
        navigate('/userFollow', { state: { postId: id } });
    };

    // 게시물 데이터를 서버에서 가져오는 함수
    useEffect(() => {
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
                // 게시물 데이터에 좋아요 상태 초기화
                setPosts(data.boardList.map(post => ({ ...post, likedByUser: false })));
            } catch (error) {
                setError(error.message);
            }
        };
        fetchPosts();
    }, []);

    return (
        <Box
            maxW="800px"
            mx="auto"
            p={4}
            bg="white"
            overflowY="auto"
            height="100vh"
        >
            <Heading mb={4} textColor="black">Home</Heading>
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
                        w="full"
                        p={4}
                        bg="white"
                    >
                        <Flex alignItems="center" mb={4}>
                            <Avatar size="md" name={post.nickname} src="https://bit.ly/sage-adebayo" />
                            <Box ml={3} cursor="pointer" onClick={() => handleNicknameClick(post.nickname)}>
                                <Text fontWeight="bold">{post.nickname}</Text>
                                <Text fontSize="sm" color="gray.500">{new Date(post.createdAt).toLocaleString()}</Text>
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
                        {post.image_url && (
                            <Image
                                borderRadius="md"
                                src={post.image_url}
                                alt="Post image"
                                mb={4}
                                boxSize="300px" // 정사각형으로 만들기 위해 크기 고정
                                objectFit="cover"
                            />
                        )}
                        {post.music_track && (
                            <>
                                <Text mb={4}>노래 제목: {post.music_track}</Text>
                                <Text mb={4}>가수: {post.music_artist}</Text>
                                <Image src={post.music_thumbnail} />
                                <audio controls src={post.music_preview_url} />
                            </>
                        )}
                        <HStack spacing={4}>
                            <Button
                                flex="1"
                                variant="ghost"
                                leftIcon={<BiLike />}
                                onClick={() => handleLike(post.board_code)} // 좋아요 토글 핸들러 호출
                            >
                                <Text id={post.board_code}>{post.likeCount}</Text>
                                <Box as="span" mx="2"></Box>
                                Like
                            </Button>
                            <Button flex="1" variant="ghost" leftIcon={<BiChat />} onClick={() => toggleComments(post.board_code)}>
                                Comment
                            </Button>
                            <Button flex="1" variant="ghost" leftIcon={<BiShare />}>
                                Share
                            </Button>
                        </HStack>
                        {showComments[post.board_code] && <CommentList boardCode={post.board_code} />}  {/* CommentList 컴포넌트 추가 */}
                    </Box>
                ))}
            </VStack>
        </Box>
    );
};

export default SearchBoard; 
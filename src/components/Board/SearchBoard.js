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
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');
    const { currentUser } = useContext(AuthContext); // 로그인 정보 확인
    let [likeCount, setLikeCount] = useState(0); // 좋아요수 카운트
    const [showComments, setShowComments] = useState( {});
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json;charset=utf-8');
    
    const [music, setMusic] = useState(null);

    const test = (e) => {
        setMusic(posts);
    }

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

        console.log('요청 보낼 내용:', requestOptions);

        fetch(`${process.env.REACT_APP_SERVER_URL}/like`, requestOptions)
            .then((response) => {
                return response.json().then((data) => {
                    const count = data.count;
                    if (response.ok) {
                        console.log('좋아요처리 성공:', count);
                        setLikeCount(count);
                    } else {
                        console.log('왜인지 실패');
                    }
                });
            })
            .catch((error) => {
                console.log('실패처리');
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

            if (!response.ok) {
                throw new Error('Failed to delete post');
            }

            // Remove the deleted post from the list
            setPosts(posts.filter(post => post.board_code !== boardCode));
        } catch (error) {
            setError(error.message);
        }
    };

    const toggleComments = (boardCode) => {
        setShowComments(prevState => ({
            ...prevState,
            [boardCode]: !prevState[boardCode],
        }));
    };

    const handleNicknameClick = (id) => {
        navigate('/userFollow', { state: { postId: id } });
    };
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
                setPosts(data.boardList);
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
                            <Box ml={3} cursor="pointer" onClick={() => handleNicknameClick(post.id)}>
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
                        <Text mb={4} >노래 제목: {post.music_track}</Text>
                        <Text mb={4} >가수: {post.music_music_artist}</Text>
                        <Image src={post.music_thumbnail} />
                        <audio controls src={post.musicPreviewUrl} />
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
                            <Button flex="1" variant="ghost" leftIcon={<BiChat />} onClick={() => toggleComments(post.board_code)}>
                                Comment
                            </Button>
                            <Button flex="1" variant="ghost" leftIcon={<BiShare />}>
                                Share
                            </Button>
                        </HStack>
                        <CommentList boardCode={post.board_code} />  {/* CommentList 컴포넌트 추가 */}
                    </Box>
                ))}
            </VStack>
        </Box>
    );
};

export default SearchBoard;
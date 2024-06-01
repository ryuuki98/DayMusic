import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box,
    Text,
    VStack,
    Heading,
    Spinner,
    Alert,
    AlertIcon,
    Flex,
    Avatar,
    IconButton,
    Image,
    Button,
    HStack,
} from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { BiChat, BiLike, BiShare } from 'react-icons/bi';
import AuthContext from '../../context/AuthContext';
import CommentList from '../Comment/CommentList'; // Import CommentList component

const BoardDetail = () => {
    const location = useLocation();
    const command = 'detail';
    const { currentUser } = useContext(AuthContext); //로그인 정보 확인
    const { boardCode } = location.state || {};
    const [post, setPost] = useState(null);
    const [error, setError] = useState('');
    const [likeCount, setLikeCount] = useState(0); //좋아요수 카운트
    const [likeList, setLikeList] = useState([]); //좋아요 리스트
    const [isHeaderVisible, setIsHeaderVisible] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json;charset=utf-8');

    const handleSubmit = (e) => {
        // 좋아요 추가/제거 이벤트
        e.preventDefault();
        const board_code = post.board_code;
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
                        console.log('좋아요처리  성공:', count);
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

    const listSubmit = (e) => {
        // 좋아요 리스트
        e.preventDefault();
        setIsHeaderVisible((prevState) => !prevState);
        const board_code = post.board_code;
        const command = 'like';

        fetch(`${process.env.REACT_APP_SERVER_URL}/like?command=${command}&board_code=${board_code}`, {
            method: 'GET',
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setLikeList(data);
            })
            .catch((error) => {
                console.log('요청 실패:', error);
            });
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
                        command: "detail",
                        board_code: boardCode,
                    }),
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch post');
                }

                const data = await response.json();
                setPost(data);
            } catch (error) {
                setError(error.message);
            } 
        };

        fetchPost();
    }, [boardCode]);

    return (
        <Box maxW="800px" mx="auto" p={4} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
            {error && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    {error}
                </Alert>
            )}
            {post ? (
                <VStack spacing={4}>
                    <Flex alignItems="center" mb={4}>
                        <Avatar size="md" name={post.nickname} src="https://bit.ly/sage-adebayo" />
                        <Box ml={3}>
                            <Text fontWeight="bold">{post.nickname}</Text>
                            <Text fontSize="sm" color="gray.500">{new Date(post.createdAt).toLocaleString()}</Text>
                        </Box>
                        <IconButton
                            variant="ghost"
                            colorScheme="gray"
                            aria-label="See menu"
                            icon={<BsThreeDotsVertical />}
                            ml="auto"
                        />
                    </Flex>
                    <Text>{post.contents}</Text>
                    {post.image_url && (
                        <Image
                            borderRadius="md"
                            src={post.image_url}
                            alt="Post image"
                            mb={4}
                            boxSize="300px"
                            objectFit="cover"
                        />
                    )}
                    {post.music_track && (
                        <>
                            <Text>노래 제목: {post.music_track}</Text>
                            <Text>가수: {post.music_artist}</Text>
                            <Image src={post.music_thumbnail} />
                            <audio controls src={post.music_preview_url} />
                        </>
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
                        <Button flex="1" variant="ghost" leftIcon={<BiChat />} onClick={() => setShowComments(!showComments)}>
                            Comment
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
                    {showComments && <CommentList boardCode={post.board_code} />} {/* 댓글 리스트 */}
                </VStack>
            ) : (
                <Spinner size="xl" />
            )}
        </Box>
    );
};

export default BoardDetail;

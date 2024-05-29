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
    Card,
    CardHeader,
    Flex,
    Avatar,
    IconButton,
    CardBody,
    CardFooter,
    Button,
} from '@chakra-ui/react';
import { BiChat, BiLike, BiShare } from 'react-icons/bi';
import AuthContext from '../../context/AuthContext';
import { BsThreeDotsVertical } from 'react-icons/bs';
// import AuthContext from '../../context/AuthContext';

const PublicBoardPosts = () => {
    const navigate = useNavigate();
    const command = "search";
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');
    const { currentUser } = useContext(AuthContext); //로그인 정보 확인
    let [likeCount, setLikeCount] = useState(0); //좋아요수 카운트
    const myHeaders = new Headers();
    myHeaders.append('Content-Type','application/json;charset=utf-8');

    const handleSubmit = (e) => {
        // 좋아요 추가제거 이벤트
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
            {(
                <VStack spacing={4}>
                    {posts.map((post) => (
                        <>
                        <Card maxW="md">
                        <CardHeader>
                            <Flex spacing="4">
                                <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                                    <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
                                    <Box>
                                        <Heading size="sm">{post.nickname}</Heading>
                                    </Box>
                                </Flex>
                                <IconButton
                                    variant="ghost"
                                    colorScheme="gray"
                                    aria-label="See menu"
                                    icon={<BsThreeDotsVertical />}
                                />
                            </Flex>
                        </CardHeader>
                        <CardBody>
                            <Text>{post.contents}</Text>
                        </CardBody>
                        <Image
                            objectFit="cover"
                            src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                            alt="Chakra UI"
                        />
                        <Text>Music code : {post.music_code}</Text>
                        <CardFooter
                            justify="space-between"
                            flexWrap="wrap"
                            sx={{
                                '& > button': {
                                    minW: '136px',
                                },
                            }}
                        >
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
                            <Button flex="1" variant="ghost" leftIcon={<BiChat />}>
                                Comment
                            </Button>
                            <Button flex="1" variant="ghost" leftIcon={<BiShare />}>
                                Share
                            </Button>
                        </CardFooter>
                    </Card>
                    </>
                    ))}
                </VStack>
            )}
        </Box>
    );
};

export default PublicBoardPosts;

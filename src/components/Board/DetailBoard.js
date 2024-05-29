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
    Card,
    CardHeader,
    Flex,
    Avatar,
    IconButton,
    CardBody,
    Image,
    CardFooter,
    Button,
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
} from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { BiChat, BiLike, BiShare } from 'react-icons/bi';
import AuthContext from '../../context/AuthContext';

const BoardDetail = () => {
    const location = useLocation();
    const command = 'detail';
    const { currentUser } = useContext(AuthContext); //로그인 정보 확인
    const { boardCode } = location.state || {};
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    let [likeCount, setLikeCount] = useState(0); //좋아요수 카운트
    let [likeList, setLikeList] = useState([]); //좋아요 리스트
    const [isHeaderVisible, setIsHeaderVisible] = useState(false);
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json;charset=utf-8');

    const handleSubmit = (e) => {
        // 좋아요 추가제거 이벤트
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
        const board_code = 2;
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
                console.log('Response: ', response.ok);
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
        <Box maxW="800px" mx="auto" p={4} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
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
                                <Button
                                    flex="1"
                                    variant="ghost"
                                    leftIcon={<BiLike />}
                                    onClick={listSubmit}
                                    value={post.board_code}
                                >
                                    Likelist
                                </Button>
                                <Button flex="1" variant="ghost" leftIcon={<BiChat />}>
                                    Comment
                                </Button>
                                <Button flex="1" variant="ghost" leftIcon={<BiShare />}>
                                    Share
                                </Button>
                            </CardFooter>
                        </Card>
                        {isHeaderVisible && (
                            <TableContainer p={2} border="1px solid" borderColor="gray.200" borderRadius="md">
                                <Table variant="striped" colorScheme="blackAlpha">
                                    <Tbody>
                                        {likeList.map((list, index) => (
                                            <Tr key={index}>
                                                <Td>
                                                    <Box display="flex" alignItems="center">
                                                        <Image
                                                            borderRadius="full"
                                                            boxSize="50px"
                                                            src={list.profileImgUrl}
                                                            alt={`${list.nickname}'s profile`}
                                                            mr={4}
                                                        />
                                                        <Text>{list.nickname}</Text>
                                                    </Box>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        )}
                    </>
                )
            )}
        </Box>
    );
};

export default BoardDetail;

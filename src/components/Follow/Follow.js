import React, { useContext, useEffect, useState } from 'react';
import {
    Box,
    Flex,
    Avatar,
    Text,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    List,
    ListItem,
    ListIcon,
    VStack,
    Divider,
    IconButton,
    Heading,
    HStack,
    Spacer
} from '@chakra-ui/react';
import { MdPerson } from 'react-icons/md';
import AuthContext from '../../context/AuthContext';
import { IoMdMusicalNotes } from "react-icons/io";
import { BiBorderAll } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import MyBoardPosts from '../Board/MyBoardList';

const Follow = () => {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [isFollowing, setIsFollowing] = useState(false);
    const [followedCount, setFollowedCount] = useState(0);
    const [followerCount, setFollowerCount] = useState(0);
    
    const [followList, setFollowList] = useState();
    const [followerList, setFollowerList] = useState();
    
    const { isOpen: isFollowListOpen, onOpen: onFollowListOpen, onClose: onFollowListClose } = useDisclosure();
    const { isOpen: isFollowerListOpen, onOpen: onFollowerListOpen, onClose: onFollowerListClose } = useDisclosure();
    
    const fetchFollowData = async () => {
        const url = `${process.env.REACT_APP_SERVER_URL}/follow/follow_list?id=${currentUser.id}`;
        const response = await fetch(url, { method: "GET" });

        const data = await response.json();
        console.log(data);

        setFollowList(data.result[0]);
        setFollowerList(data.result[1]);
        setFollowedCount(data.result[0].length);
        setFollowerCount(data.result[1].length);
        setIsFollowing(data.result[0].some(follow => follow.id === currentUser.id));
    };

    const fetchFollowList = async () => {
        const url = `${process.env.REACT_APP_SERVER_URL}/follow/follow_list?id=${currentUser.id}`;
        const response = await fetch(url, { method: "GET" });

        const data = await response.json();
        console.log(data);

        setFollowList(data.result[0]);
        setFollowerList(data.result[1]);
        setFollowedCount(data.result[0].length);
        setFollowerCount(data.result[1].length);
    };

    useEffect(() => {
        fetchFollowData();
        fetchFollowList();
    }, []);

    const handleFollowCheck = (e) => {
        e.preventDefault();
        const command = isFollowing ? "delete" : "add";
        const id = currentUser.id;
        const youId = "user4";
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json;charset=utf-8');

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                command: command,
                followedId: id,
                followerId: youId,
            }),
        };
        console.log("보낸내용:", requestOptions);

        fetch(`${process.env.REACT_APP_SERVER_URL}/follow`, requestOptions)
            .then((response) => {
                return response.json().then((result) => {
                    if (response.ok) {
                        console.log('팔로우처리 성공:', result);
                        setIsFollowing(!isFollowing);
                        fetchFollowList();
                    } else {
                        console.log('실패');
                    }
                });
            }).catch((error) => {
                console.log('실패처리');
            });
        console.log(command, id);
    };

    const navigateMyBoard = () => {
        navigate('/board/myBoard');
    };

    return (
        <Box maxW="700px" mx="auto" mt="5">
            <Flex align="center" mb="4">
                <Avatar size="2xl" name={currentUser.nickname} src={currentUser.avatarUrl} />
                <VStack ml="200px">
                    <Text fontSize="20px">1</Text> 
                    <Button colorScheme='gray' variant='ghost' width="50%">게시물</Button>  
                </VStack>
                <VStack>
                    <Text fontSize="20px">{followerCount}</Text>
                    <Button colorScheme='gray' variant='ghost' width="50%" onClick={onFollowerListOpen}>팔로워</Button>
                </VStack>
                <VStack>
                    <Text fontSize="20px">{followedCount}</Text>
                    <Button colorScheme='gray' variant='ghost' width="50%" onClick={onFollowListOpen}>팔로잉</Button>
                </VStack>
            </Flex>
            <Flex align="center" justify="space-between" mb="4">
                <Heading size="md" ml="25px">{currentUser.nickname}</Heading>
                {currentUser.id !== 'your_current_user_id' && (
                    <Button colorScheme='gray' onClick={handleFollowCheck}>
                        {isFollowing ? '팔로우 취소' : '팔로우'}
                    </Button>
                )}
            </Flex>
            <Divider my="4" />
            <HStack justify="space-between" mb="4" px="20%">
                <IconButton icon={<BiBorderAll />} boxSize="2rem" size="lg" variant="ghost" onClick={navigateMyBoard}/>
                <Spacer />
                <IconButton icon={<IoMdMusicalNotes />} boxSize="2rem" size="lg" variant="ghost" />
            </HStack>
            <Divider my="4" />

            <VStack spacing="4">
                {[1, 2, 3].map((_, idx) => (
                    <Box key={idx} w="100%" p="4" borderWidth="1px" borderRadius="lg">
                        <Flex align="center">
                            <Avatar name="Charles" size="sm" />
                            <Box ml="3">
                                <Text fontWeight="bold">Charles</Text>
                                <Text fontSize="sm" color="gray.500">2 hrs ago</Text>
                            </Box>
                        </Flex>
                        <Text mt="2">Body text for a post. Since it's a social app, sometimes it's a hot take, and sometimes it's a question.</Text>
                        <Flex mt="2" align="center">
                            <Text fontSize="sm">6 likes</Text>
                            <Text fontSize="sm" ml="4">18 comments</Text>
                        </Flex>
                    </Box>
                ))}
            </VStack>
            <Flex justify="space-between" mt="4" px="4" py="2" borderTopWidth="1px">
            </Flex>

            {/* 팔로우 리스트 모달 */}
            <Modal isOpen={isFollowListOpen} onClose={onFollowListClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>팔로잉</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <List spacing={3}>
                            {followList && followList.map((user, index) => (
                                <ListItem key={index}>
                                    <ListIcon as={MdPerson} color="green.500" />
                                    {user.nickname}
                                </ListItem>
                            ))}
                        </List>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant='ghost' onClick={onFollowListClose}>닫기</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* 팔로워 리스트 모달 */}
            <Modal isOpen={isFollowerListOpen} onClose={onFollowerListClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>팔로워</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <List spacing={3}>
                            {followerList && followerList.map((user, index) => (
                                <ListItem key={index}>
                                    <ListIcon as={MdPerson} color="blue.500" />
                                    {user.nickname}
                                </ListItem>
                            ))}
                        </List>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant='ghost' onClick={onFollowerListClose}>닫기</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default Follow;

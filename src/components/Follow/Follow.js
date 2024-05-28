import React, { useContext, useEffect, useState } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Flex,
    Avatar,
    Box,
    Heading,
    Text,
    IconButton,
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
    ListIcon
} from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdPerson } from 'react-icons/md';
import AuthContext from '../../context/AuthContext';

const Follow = () => {
    // 로그인 한 유저의 아이디,닉네임 사용가능
    const {currentUser} = useContext(AuthContext);  

    // 팔로우 상태와 팔로워 수를 관리하는 useState 훅
    const [isFollowing, setIsFollowing] = useState(false);
    const [followedCount, setFollowedCount] = useState(0);
    const [followerCount, setFollowerCount] = useState(0);

    // 팔로우 및 팔로워 리스트 관리하는 useState 훅
    const [followList, setFollowList] = useState();
    const [followerList, setFollowerList] = useState();

    // 모달 관리를 위한 useDisclosure 훅
    const { isOpen: isFollowListOpen, onOpen: onFollowListOpen, onClose: onFollowListClose } = useDisclosure();
    const { isOpen: isFollowerListOpen, onOpen: onFollowerListOpen, onClose: onFollowerListClose } = useDisclosure();

    // 로그인 한 유저의 팔로잉, 팔로우 리스트 출력
    const fetchFollowData = async () => {
        const url = `${process.env.REACT_APP_SERVER_URL}/follow/follow_list?id=${currentUser.id}`;
        const response = await fetch(
            url,
            {
                method: "GET",
            }
        )
        
        const data = await response.json();
        console.log(data);

        setFollowList(data.result[0]);
        setFollowerList(data.result[1]);
    };

    useEffect(() => {
        fetchFollowData();
    }, []);
    
    // 버튼 클릭 시 호출되는 핸들러 함수
    const handleFollowClick = () => {
        setIsFollowing(!isFollowing);
        setFollowedCount(isFollowing ? followedCount - 1 : followedCount + 1);
        setFollowerCount(isFollowing ? followerCount - 1 : followerCount + 1);
    };

    // 팔로우 추가,취소 처리
    const handleSubmit = (e) => {
        e.preventDefault();
        const command = isFollowing ? "delete" : "add";
        const id = currentUser.id;
        const youId = "user4";
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json;charset=utf-8');

        const requestOptions = {
            method : 'POST',
            headers : myHeaders,
            body : JSON.stringify({
                command: command,
                followedId: id,
                followerId: youId,
            }),
        };
        console.log("보낸내용:", requestOptions);

        fetch(`${process.env.REACT_APP_SERVER_URL}/follow`,requestOptions)
        .then((response) => {
            return response.text().then((result) =>{
                if(response.ok){
                    console.log('팔로우처리 성공:',result);
                    handleFollowClick(result);
                }else{
                    console.log('실패');
                }
            });
        }).catch((error) =>{
            console.log('실패처리');
        });
        console.log(command, id);
    }

    return (
        <Card maxW='md'>
            <CardHeader>
                <Flex spacing='4'>
                    <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                        <Avatar name='currentUser' />
                        <Box>
                            <Heading size='sm'>{currentUser.nickname}</Heading>
                            <Text>Creator, Chakra UI</Text>
                        </Box>
                    </Flex>
                    <IconButton
                        variant='ghost'
                        colorScheme='gray'
                        aria-label='See menu'
                        icon={<BsThreeDotsVertical />}
                    />
                </Flex>
            </CardHeader>
            <CardBody>
                <Text mt={4}>
                    Followed: {followedCount}명
                </Text>
                <Text mt={4}>
                    Follower: {followerCount}명
                </Text>
            </CardBody>
            <CardFooter
                justify='space-between'
                flexWrap='wrap'
                sx={{
                    '& > button': {
                        minW: '136px',
                    },
                }}
            >
                <Button flex='1' variant='ghost' onClick={handleSubmit}>
                    {isFollowing ? '팔로우 취소' : '팔로우'}
                </Button>
                <Button flex='1' variant='ghost' onClick={onFollowListOpen}>
                    팔로잉
                </Button>
                <Button flex='1' variant='ghost' onClick={onFollowerListOpen}>
                    팔로워
                </Button>
            </CardFooter>

            {/* 팔로우 리스트 모달 */}
            <Modal isOpen={isFollowListOpen} onClose={onFollowListClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>팔로잉</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <List spacing={3}>
                            {followList && followList.map((currentUser, index) => (
                                <ListItem key={index}>
                                    <ListIcon as={MdPerson} color="green.500" />
                                    {currentUser.nickname}
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
                            {followerList && followerList.map((currentUser, index) => (
                                <ListItem key={index}>
                                    <ListIcon as={MdPerson} color="blue.500" />
                                    {currentUser.nickname}
                                </ListItem>
                            ))}
                        </List>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant='ghost' onClick={onFollowerListClose}>닫기</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Card>


    );
};

export default Follow;
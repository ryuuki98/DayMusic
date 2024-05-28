import React, { useEffect, useState } from 'react';
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

const Follow = () => {
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

    // 더미 데이터 설정
    // useEffect(() => {
    //     // API 호출로 데이터 가져오기
    //     const fetchFollowData = async () => {
    //         const followResponse = await fetch('/follow/followed_list');
    //         const followerResponse = await fetch('/follow/follower_list');

    //         const followData = await followResponse.json();
    //         const followerData = await followerResponse.json();

    //         setFollowList(followData);
    //         setFollowerList(followerData);
    //     };

    //     fetchFollowData();
    // }, []);

    // 버튼 클릭 시 호출되는 핸들러 함수
    const handleFollowClick = () => {
        if (isFollowing) {
            setFollowedCount(followedCount - 1);
        } else {
            setFollowedCount(followedCount + 1);
        }
        setIsFollowing(!isFollowing);
    };

    return (
        <Card maxW='md'>
            <CardHeader>
                <Flex spacing='4'>
                    <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                        <Avatar name='User1' />
                        <Box>
                            <Heading size='sm'>User1</Heading>
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
                <Button flex='1' variant='ghost' onClick={handleFollowClick}>
                    {isFollowing ? '팔로우 취소' : '팔로우'}
                </Button>
                <Button flex='1' variant='ghost' onClick={onFollowListOpen}>
                    팔로우 리스트
                </Button>
                <Button flex='1' variant='ghost' onClick={onFollowerListOpen}>
                    팔로워 리스트
                </Button>
            </CardFooter>

            {/* 팔로우 리스트 모달 */}
            <Modal isOpen={isFollowListOpen} onClose={onFollowListClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>팔로우 리스트</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <List spacing={3}>
                            {followList && followList.map((user, index) => (
                                <ListItem key={index}>
                                    <ListIcon as={MdPerson} color="green.500" />
                                    {user}
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
                    <ModalHeader>팔로워 리스트</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <List spacing={3}>
                            {followerList && followerList.map((user, index) => (
                                <ListItem key={index}>
                                    <ListIcon as={MdPerson} color="blue.500" />
                                    {user}
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
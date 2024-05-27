import React, { useState } from 'react';
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
    Image,
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
    const [followersCount, setFollowersCount] = useState(100); // 초기 팔로워 수를 100으로 설정

    // 팔로우 및 팔로워 리스트 관리하는 useState 훅
    const [followList, setFollowList] = useState(['user1', 'user2', 'user3']);
    const [followerList, setFollowerList] = useState(['user4', 'user5', 'user6']);

    // 모달 관리를 위한 useDisclosure 훅
    const { isOpen: isFollowListOpen, onOpen: onFollowListOpen, onClose: onFollowListClose } = useDisclosure();
    const { isOpen: isFollowerListOpen, onOpen: onFollowerListOpen, onClose: onFollowerListClose } = useDisclosure();

    // 버튼 클릭 시 호출되는 핸들러 함수
    const handleFollowClick = () => {
        if (isFollowing) {
            setFollowersCount(followersCount - 1);
        } else {
            setFollowersCount(followersCount + 1);
        }
        setIsFollowing(!isFollowing);
    };

    return (
        <Card maxW='md'>
            <CardHeader>
                <Flex spacing='4'>
                    <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                        <Avatar name='Segun Adebayo' src='https://bit.ly/sage-adebayo' />
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
                    Followers: {followersCount}명
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
                            {followList.map((user, index) => (
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
                            {followerList.map((user, index) => (
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
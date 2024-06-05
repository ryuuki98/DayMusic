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
import UserBoardPosts from '../Board/UserBoardList';
import UserMusicBoardPosts from '../Board/UserMusicBoardList';
import { useLocation } from 'react-router-dom';

const UserFollow = () => {
    // 게시글 유저의 아이디
    const location = useLocation();
    const postId = location.state.postId;
    
    // 로그인 한 유저의 아이디,닉네임 사용가능
    const { currentUser } = useContext(AuthContext);
    
    // 내 게시글 불러오기
    const [showMyBoardPosts, setShowMyBoardPosts] = useState(false);

    // 내 뮤직 게시글 불러오기
    const [showMyMusicBoardPosts, setShowMyMusicBoardPosts] = useState(false);
    
    // 게시글 수 상태 추가
    const [postCount, setPostCount] = useState(0); 

    // 뮤직 게시글 수 상태 추가
    const [MusicpostCount, setMusicPostCount] = useState(0);

    // 팔로우 상태와 팔로워 수를 관리
    const [isFollowing, setIsFollowing] = useState(false);
    const [followedCount, setFollowedCount] = useState(0);
    const [followerCount, setFollowerCount] = useState(0);
    
    // 본인 프로필 이미지 관리
    const [profileImg, setProfileImg] = useState('');

    // 팔로우 및 팔로워 리스트 관리
    const [followList, setFollowList] = useState([]);
    const [followerList, setFollowerList] = useState([]);
    
    // 팔로우 및 팔로워 모달 관리
    const { isOpen: isFollowListOpen, onOpen: onFollowListOpen, onClose: onFollowListClose } = useDisclosure();
    const { isOpen: isFollowerListOpen, onOpen: onFollowerListOpen, onClose: onFollowerListClose } = useDisclosure();
    
    // 로그인 한 유저의 팔로잉, 팔로우 리스트 출력
    const fetchFollowData = async () => {
        const url = `${process.env.REACT_APP_SERVER_URL}/follow/follow_list?id=${postId}&currentId=${currentUser.id}`;
        const response = await fetch(url, { method: "GET" });
        const data = await response.json();

        setFollowList(data.result[1]);
        setFollowerList(data.result[0]);
        setFollowedCount(data.result[1].length);
        setFollowerCount(data.result[0].length);
        setIsFollowing(data.result[0].some(follow => follow.nickname === currentUser.nickname));
    };

    // 사용자 게시글 수 가져오기
    const fetchPostCount = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/board/service`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    id: postId,
                    command: 'myBoard'
                }),
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                setPostCount(data.boardList.length);
            } else {
                throw new Error('Failed to fetch posts');
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    // 사용자 뮤직 게시글 수 가져오기
    const fetchMusicPostCount = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/board/service`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    id: currentUser.id,
                    command: 'myMusicBoard',
                }),
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                setMusicPostCount(data.boardList.length);
            } else {
                throw new Error('Failed to fetch posts');
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchFollowData();
    }, []);

    useEffect(() => {
        fetchPostCount();
        fetchMusicPostCount();

        fetch(`${process.env.REACT_APP_SERVER_URL}/image/service?userId=${postId}`, {
            method: 'GET',
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.profileImageUrl) {
                    setProfileImg(data.profileImageUrl);
                    console.log("Fetched profile image URL:", data.profileImageUrl);
                }
            })
            .catch((error) => {
                console.error('Error fetching profile image:', error);
            });
    }, []);

     // 팔로우 추가,취소 처리
    const handleFollowCheck = async (e) => {
        e.preventDefault();
        const command = isFollowing ? "delete" : "add";
        const id = postId;
        const youId = currentUser.id;
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json;charset=utf-8');

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                command: command,
                followedId: youId,
                followerId: id,
            }),
        };
        console.log("보낸내용:", requestOptions);

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/follow`, requestOptions);
            const result = await response.json();
            if (response.ok) {
                console.log('팔로우처리 성공:', result);
                setIsFollowing(!isFollowing);
                fetchFollowData();
            } else {
                console.log('실패');
            }
        } catch (error) {
            console.log('실패처리');
        }
    };

    const toggleMyBoardPosts  = () => {
        setShowMyBoardPosts(!showMyBoardPosts);
    };

    const toggleMyMusicBoardPosts = () => {
        setShowMyMusicBoardPosts(!showMyMusicBoardPosts);
    };

    return (
        <Box maxW="700px" mx="auto" mt="5">
            <Flex align="center" mb="4">
                <Avatar size="2xl" name={postId} src={profileImg} />
                <VStack ml="200px">
                    <Text fontSize="20px">{postCount}</Text> 
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
                <Heading size="md" ml="25px">{postId}</Heading>
                {currentUser.id !== postId && (
                    <Button colorScheme='gray' onClick={handleFollowCheck}>
                        {isFollowing ? '팔로우 취소' : '팔로우'}
                    </Button>
                )}
            </Flex>
            <Divider my="4" />
            <HStack justify="space-between" mb="4" px="20%">
                <IconButton icon={<BiBorderAll />} boxSize="2rem" size="lg" variant="ghost" onClick={toggleMyBoardPosts}/>
                <Spacer />
                <IconButton icon={<IoMdMusicalNotes />} boxSize="2rem" size="lg" variant="ghost" onClick={toggleMyMusicBoardPosts}/>
            </HStack>
            <Divider my="4" />
            
            {/* MyBoardPosts 컴포넌트를 조건부로 렌더링 */}
            {showMyBoardPosts && <UserBoardPosts userId={postId} />}
            {showMyMusicBoardPosts && <UserMusicBoardPosts userId={postId} />}

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

export default UserFollow;

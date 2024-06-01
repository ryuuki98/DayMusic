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
import MyBoardList from '../Board/MyBoardList';
import { useLocation } from 'react-router-dom';

const Follow = () => {
    // 로그인 한 유저의 아이디,닉네임 사용가능
    const { currentUser } = useContext(AuthContext);

    const location = useLocation();
    const postId = location.state?.postId || currentUser.id;
    console.log("postId가 도대체 뭐야?", postId);
    // 내 게시글 불러오기
    const [showMyBoardPosts, setShowMyBoardPosts] = useState(false);
    
    // 게시글 수 상태 추가
    const [postCount, setPostCount] = useState(0); 
    
    // 팔로우 상태와 팔로워 수를 관리
    const [isFollowing, setIsFollowing] = useState(false);
    const [followedCount, setFollowedCount] = useState(0);
    const [followerCount, setFollowerCount] = useState(0);

    // 본인 프로필 이미지 관리
    const [profileImg, setProfileImg] = useState('');
    
    // 팔로우 및 팔로워 리스트 관리
    const [followList, setFollowList] = useState();
    const [followerList, setFollowerList] = useState();
    
    // 팔로우 및 팔로워 모달 관리
    const { isOpen: isFollowListOpen, onOpen: onFollowListOpen, onClose: onFollowListClose } = useDisclosure();
    const { isOpen: isFollowerListOpen, onOpen: onFollowerListOpen, onClose: onFollowerListClose } = useDisclosure();
    
    // 로그인 한 유저의 팔로잉, 팔로우 리스트 출력
    const fetchFollowData = async () => {
        const url = `${process.env.REACT_APP_SERVER_URL}/follow/follow_list?id=${currentUser.id}`;
        const response = await fetch(url, { method: "GET" });

        const data = await response.json();
        console.log(data);

        setFollowList(data.result[1]);
        setFollowerList(data.result[0]);
        setFollowedCount(data.result[1].length);
        setFollowerCount(data.result[0].length);
        setIsFollowing(data.result[1].some(follow => follow.id === currentUser.id)); // 여기에서 초기 팔로우 상태를 설정
    };

    const fetchFollowList = async () => {
        const url = `${process.env.REACT_APP_SERVER_URL}/follow/follow_list?id=${currentUser.id}`;
        const response = await fetch(url, { method: "GET" });

        const data = await response.json();
        console.log(data);

        setFollowList(data.result[1]);
        setFollowerList(data.result[0]);
        setFollowedCount(data.result[1].length);
        setFollowerCount(data.result[0].length);
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
                    id: currentUser.id,
                    command: 'myBoard'
                }),
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                console.log("게시글 불러오기 성공")
                setPostCount(data.boardList.length); // 게시글 수 업데이트
            } else {
                console.log("게시글 불러오기 실패");
                throw new Error('Failed to fetch posts');
            }
        } catch (error) {
            console.log("실패");
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchFollowData();
        fetchFollowList();
        fetchPostCount();

        fetch(`${process.env.REACT_APP_SERVER_URL}/image/service?userId=${currentUser.id}`, {
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
    const handleFollowCheck = (e) => {
        e.preventDefault();
        const command = isFollowing ? "delete" : "add";
        const id = currentUser.id;
        const youId = postId; // 여기는 임의 아이디이니께 나중에 바꿔야대!
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

    const toggleMyBoardPosts  = () => {
        setShowMyBoardPosts(!showMyBoardPosts);
    };

    return (
        <Box maxW="700px" mx="auto" mt="5">
            <Flex align="center" mb="4">
                <Avatar size="2xl" name={currentUser.nickname} src={profileImg} />
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
                <Heading size="md" ml="25px">{currentUser.nickname}</Heading>
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
                <IconButton icon={<IoMdMusicalNotes />} boxSize="2rem" size="lg" variant="ghost" />
            </HStack>
            <Divider my="4" />
            
            {/* MyBoardPosts 컴포넌트를 조건부로 렌더링 */}
            {showMyBoardPosts && <MyBoardList onPostCountChange={setPostCount} fetchPostCount={fetchPostCount} />}

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

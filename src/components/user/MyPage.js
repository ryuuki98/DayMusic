import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Text,
    Stack,
    Image,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
    Input,
    useToast,
    Icon,
    Button,
} from '@chakra-ui/react';
import { FaCamera } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import UpdatePassword from './UpdatePassword';
import UpdateNickname from './UpdateNickname';
import UpdateUserInfo from './UpdateUserInfo';

const MyPage = () => {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();
    const [isDeleting, setIsDeleting] = useState(false);
    const [profileImg, setProfileImg] = useState('');
    const [file, setFile] = useState(null);
    const inputFileRef = useRef(null);
    const toast = useToast();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/image/service?userId=${currentUser.id}`, {
            method: 'GET',
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.profileImageUrl) {
                    setProfileImg(data.profileImageUrl);
                    console.log('Fetched profile image URL:', data.profileImageUrl);
                }
            })
            .catch((error) => {
                console.error('Error fetching profile image:', error);
            });
    }, [currentUser, navigate]);

    const handleDelete = () => {
        setIsDeleting(true);

        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json;charset=utf-8');

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                command: 'deleteUser',
                id: currentUser.id,
            }),
            credentials: 'include',
        };

        fetch(`${process.env.REACT_APP_SERVER_URL}/user/service`, requestOptions)
            .then((response) => {
                return response.json().then((data) => {
                    if (response.ok) {
                        console.log('탈퇴가 완료 되었습니다:', data);
                    } else {
                        console.error('탈퇴 실패:', data);
                    }
                });
            })
            .catch((error) => {
                console.error('로그인 오류:', error);
            });

        setTimeout(() => {
            setIsDeleting(false);
            onClose();
            alert('탈퇴가 완료 되었습니다');
            navigate('/');
        }, 2000);
    };

    const handleImageClick = () => {
        inputFileRef.current.click();
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfileImg(event.target.result);
            };
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append('profileImage', file);
            formData.append('userId', currentUser.id);
            formData.append('command', 'profileImage');

            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/image/service`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.text();
                    toast({
                        title: 'Profile image uploaded successfully',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    });
                } else {
                    throw new Error('Upload failed');
                }
            } catch (error) {
                toast({
                    title: 'Error uploading profile image',
                    description: error.message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" mt={8} p={4}>
            <Box position="relative" cursor="pointer" onClick={handleImageClick}>
                <Image borderRadius="full" boxSize="150px" src={profileImg} alt="Profile Image" />
                <Box position="absolute" bottom="0" right="0" bg="white" borderRadius="full" p={2} cursor="pointer">
                    <Icon as={FaCamera} w={6} h={6} color="gray.500" />
                </Box>
                <Input type="file" ref={inputFileRef} display="none" onChange={handleImageChange} />
            </Box>
            <Text fontSize="2xl" fontWeight="bold" mt={4} color="black">
                {currentUser.nickname}
            </Text>
            <Text fontSize="md" color="gray.600" mb={4}>
                ID: {currentUser.id}
            </Text>

            <Tabs variant="soft-rounded" colorScheme="gray" mt={8} w="full" maxW="md">
                <TabList>
                    <Tab>비밀번호 재설정</Tab>
                    <Tab>닉네임 변경</Tab>
                    <Tab>개인정보 변경</Tab>
                    <Tab>회원탈퇴</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <UpdatePassword />
                    </TabPanel>
                    <TabPanel>
                        <UpdateNickname />
                    </TabPanel>
                    <TabPanel>
                        <UpdateUserInfo />
                    </TabPanel>
                    <TabPanel>
                        <Button w="full" bg="red.700" color="white" onClick={onOpen}>
                            회원 탈퇴
                        </Button>
                    </TabPanel>
                </TabPanels>
            </Tabs>

            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            회원 탈퇴
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            회원을 탈퇴하시겠습니까? 회원 탈퇴 시 작성되었던 글이 전부 사라집니다.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                아니오
                            </Button>
                            <Button colorScheme="red" onClick={handleDelete} ml={3} isLoading={isDeleting}>
                                예
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default MyPage;

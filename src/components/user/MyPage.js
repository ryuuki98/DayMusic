import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
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
} from '@chakra-ui/react';
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
    const [profileImg, setProfileImg] = useState('https://via.placeholder.com/150');
    const inputFileRef = useRef(null);

    useEffect(() => {
        if (currentUser === null) {
            alert('로그인을 해야합니다.');
            navigate('/');
        }
    }, [currentUser, navigate]);

    if (currentUser === null) {
        return null; 
    }

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfileImg(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" mt={8} p={4}>
            <Box position="relative" onClick={handleImageClick} cursor="pointer">
                <Image
                    borderRadius="full"
                    boxSize="150px"
                    src={profileImg}
                    alt="Profile Image"
                />
                <Input
                    type="file"
                    ref={inputFileRef}
                    display="none"
                    onChange={handleImageChange}
                />
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
                        <UpdatePassword/>
                    </TabPanel>
                    <TabPanel>
                        <UpdateNickname/>
                    </TabPanel>
                    <TabPanel>
                        <UpdateUserInfo/>
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

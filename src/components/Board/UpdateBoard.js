import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Textarea, Switch, Text, VStack, HStack, IconButton, Alert, AlertIcon, Heading } from '@chakra-ui/react';
import AuthContext from '../../context/AuthContext';
// import SpotifySearch from '../spotify/SpotifySearch';
import { EditIcon } from '@chakra-ui/icons';

const UpdatePost = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { postId } = useParams();
    const { boardCode } = location.state || {};
    const { currentUser } = useContext(AuthContext);
    const [contents, setContents] = useState('');
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [isPublic, setIsPublic] = useState(false);
    const [showSpotifySearch, setShowSpotifySearch] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
        if (!currentUser) {
            console.log("비로그인 상태");
            alert("로그인을 해야합니다.");
            navigate('/');
        } else {
            console.log("로그인 상태");
            fetchPostInfo(postId);
        }
    }, [currentUser, navigate, postId]);

    const fetchPostInfo = async (postId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/board/service`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    command: 'detail',
                    board_code: boardCode,
                }),
            });

            if (!response.ok) {
                throw new Error('게시글 정보를 가져오는데 실패했습니다.');
            }

            const data = await response.json();
            setContents(data.contents);
            setSelectedTrack(data.selectedTrack);
            setIsPublic(data.isPublic);
        } catch (error) {
            console.error('게시글 정보 가져오기 실패:', error.message);
            setError('게시글 정보를 가져오는 데 실패했습니다.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updateData = {
            id: currentUser.id,
            nickname: currentUser.nickname,
            contents: contents,
            board_code: boardCode,
            // selectedTrack: selectedTrack,
            isPublic: isPublic,
            command: 'update'
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/board/service`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                console.log('게시글 수정 성공:');
                setSuccess('게시글이 수정되었습니다.');
                setError('');
                navigate('/board/myBoard');
            } else {
                throw new Error('게시글 수정 실패');
            }
        } catch (error) {
            console.error('게시글 수정 실패:', error.message);
            setSuccess('');
            setError('게시글 수정에 실패했습니다.');
        }
    };

    return (
        <Box
            maxW="600px"
            mx="auto"
            p={4}
            borderWidth={1}
            borderRadius="lg"
            boxShadow="lg"
            bg="white"
        >
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                {error && (
                    <Alert status="error" mb={4}>
                        <AlertIcon />
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert status="success" mb={4}>
                        <AlertIcon />
                        {success}
                    </Alert>
                )}
                <Text fontSize="lg" fontWeight="bold" textColor="black">
                    작성자: {currentUser.nickname}
                </Text>
                <Heading textColor="black">내용</Heading>
                <FormControl id="contents" isRequired>
                    <Textarea
                        textColor="black"
                        placeholder="내용을 입력하세요."
                        value={contents}
                        onChange={(e) => setContents(e.target.value)}
                    />
                </FormControl>
                <HStack width="full" justifyContent="space-between">
                    <Button colorScheme="purple" textColor="black" variant="solid" onClick={() => setShowSpotifySearch(!showSpotifySearch)}>
                        + Music
                    </Button>
                    <IconButton
                        icon={<EditIcon />}
                        colorScheme="purple"
                        variant="outline"
                        aria-label="Edit"
                    />
                </HStack>
                {/* {showSpotifySearch && <SpotifySearch onSelectTrack={setSelectedTrack} />} */}
                {/* {selectedTrack && (
                    <Text textColor="black">
                        Selected Track: {selectedTrack.name} by {selectedTrack.artists[0].name}
                    </Text>
                )} */}
                <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="isPublic" mb="0" textColor="purple">
                        공개 여부
                    </FormLabel>
                    <Switch
                        id="isPublic"
                        isChecked={isPublic}
                        onChange={() => setIsPublic(!isPublic)}
                    />
                </FormControl>
                <Button type="submit" colorScheme="blue" width="full">
                    수정하기
                </Button>
                {responseMessage && <Text textColor="red">{responseMessage}</Text>}
            </VStack>
        </Box>
    );
};

export default UpdatePost;

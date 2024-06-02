import React, { useContext, useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Switch,
    Textarea,
    VStack,
    Heading,
    Text,
    HStack,
    IconButton,
    Image,
    useToast,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import SpotifySearch from './SpotifySearch';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const CreateBoardPost = () => {
    const { currentUser } = useContext(AuthContext);
    const command = "write";
    const [contents, setContents] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [showSpotifySearch, setShowSpotifySearch] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFile(selectedFile);
                setFilePreview(event.target.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleRemoveImage = () => {
        setFile(null);
        setFilePreview('');
    };

    const uploadImage = async (boardCode) => {
        const formData = new FormData();
        formData.append('image', file); // 게시글 이미지로 설정
        formData.append('boardCode', boardCode);
        formData.append('command','boardImage');

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/image/service`, {
                method: 'POST', // PUT 메서드 사용
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error uploading image: ${response.statusText}`);
            }

            const data = await response.text();
            return data.imageUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const musicTrack = selectedTrack ? selectedTrack.name : "";
        const musicArtist = selectedTrack ? selectedTrack.artists[0].name : "";
        const musicPreviewUrl = selectedTrack ? selectedTrack.preview_url : "";
        const musicThumbnail = selectedTrack ? selectedTrack.album.images[2]?.url : "";

        try {
            const postData = {
                id: currentUser.id,
                nickname: currentUser.nickname,
                command: command,
                contents: contents,
                isPublic: isPublic,
                musicTrack: musicTrack,
                musicArtist: musicArtist,
                musicPreviewUrl: musicPreviewUrl,
                musicThumbnail: musicThumbnail,
            };

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/board/service`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData),
                credentials: 'include',
            });

            if (response.ok) {
                const responseData = await response.json();
                const boardCode = responseData.boardCode;

                if (file) {
                    await uploadImage(boardCode);
                }

                setResponseMessage('Post created successfully!');
                toast({
                    title: "게시글이 성공적으로 작성되었습니다.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                navigate('/board/search');
            } else {
                const errorText = await response.text();
                throw new Error(`Failed to create post: ${errorText}`);
            }
        } catch (error) {
            setResponseMessage('Failed to create post.');
            console.error('There was an error!', error);
            toast({
                title: "게시글 작성 실패.",
                description: "게시글 작성에 실패했습니다. 다시 시도해주세요.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
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
                <Text fontSize="lg" fontWeight="bold" textColor="black">
                    작성자: {currentUser.nickname}
                </Text>
                <FormControl id="file">
                    <FormLabel>Upload Photo</FormLabel>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </FormControl>
                {filePreview && (
                    <Box position="relative">
                        <Image src={filePreview} alt="preview" boxSize="100px" objectFit="cover" />
                        <IconButton
                            icon={<CloseIcon />}
                            size="xs"
                            position="absolute"
                            top="2px"
                            right="2px"
                            onClick={handleRemoveImage}
                        />
                    </Box>
                )}
                <Heading textColor="black">내용</Heading>
                <FormControl id="contents" isRequired>
                    <Textarea
                        textColor="black"
                        placeholder="내용을 입력하세요"
                        value={contents}
                        onChange={(e) => setContents(e.target.value)}
                    />
                </FormControl>
                <HStack width="full" justifyContent="space-between">
                    <Button colorScheme="purple" textColor="black" variant="solid" onClick={() => setShowSpotifySearch(!showSpotifySearch)}>
                        + Music
                    </Button>
                </HStack>
                {showSpotifySearch && <SpotifySearch onSelectTrack={setSelectedTrack} />}
                {selectedTrack && (
                    <>
                        <Text textColor="black">
                            선택 노래: {selectedTrack.name} by {selectedTrack.artists[0].name}
                            <Image src={selectedTrack.album.images[2]?.url}></Image>
                        </Text>
                        <audio controls src={selectedTrack.preview_url}></audio>
                    </>
                )}
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
                    Create Post
                </Button>
                {responseMessage && <Text textColor="red">{responseMessage}</Text>}
            </VStack>
        </Box>
    );
};

export default CreateBoardPost;

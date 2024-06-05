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
    Text,
    HStack,
    IconButton,
    Image,
    useToast,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Heading,
} from '@chakra-ui/react';
import { CloseIcon, AddIcon } from '@chakra-ui/icons';
import SpotifySearch from './SpotifySearch';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const CreateBoardPost = () => {
    const { currentUser } = useContext(AuthContext);
    const command = 'write';
    const [contents, setContents] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [showSpotifySearch, setShowSpotifySearch] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();
    const cancelRef = React.useRef();

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
        formData.append('image', file);
        formData.append('boardCode', boardCode);
        formData.append('command', 'boardImage');

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/image/service`, {
                method: 'POST',
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
        const musicTrack = selectedTrack ? selectedTrack.name : '';
        const musicArtist = selectedTrack ? selectedTrack.artists[0].name : '';
        const musicPreviewUrl = selectedTrack ? selectedTrack.preview_url : '';
        const musicThumbnail = selectedTrack ? selectedTrack.album.images[2]?.url : '';
        const musicUrl = selectedTrack ? selectedTrack.external_urls.spotify : '';//뭐였지: '';

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
                musicUrl: musicUrl,
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
                    title: '게시글이 성공적으로 작성되었습니다.',
                    status: 'success',
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
                title: '게시글 작성 실패.',
                description: '게시글 작성에 실패했습니다. 다시 시도해주세요.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box maxW="600px" mx="auto" p={4} borderRadius="lg" boxShadow="lg" bg="transparent" borderWidth={1} borderColor="gray.300">
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                    작성자: {currentUser.nickname}
                </Text>
                <FormControl id="file" align="center">
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        display="none"
                        id="file-input"
                    />
                    <FormLabel htmlFor="file-input" cursor="pointer">
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            width={filePreview ? "500px" : "100px"}
                            height={filePreview ? "500px" : "100px"}
                            mx="auto"
                        >
                            {filePreview ? (
                                <Image src={filePreview} alt="preview" boxSize="500px" objectFit="cover" />
                            ) : (
                                <AddIcon boxSize={8} color="gray.400" />
                            )}
                        </Box>
                    </FormLabel>
                    {filePreview && (
                        <IconButton
                            icon={<CloseIcon />}
                            size="sm"
                            position="absolute"
                            top="2px"
                            right="2px"
                            onClick={handleRemoveImage}
                        />
                    )}
                </FormControl>
                <Heading size="md" color="gray.800" alignSelf="start">내용</Heading>
                <FormControl id="contents" isRequired>
                    <Textarea
                        placeholder="내용을 입력하세요"
                        value={contents}
                        onChange={(e) => setContents(e.target.value)}
                        height="200px"
                        bg="transparent"
                        borderColor="gray.300"
                        _placeholder={{ color: 'gray.500' }}
                        color="gray.800"
                    />
                </FormControl>
                <HStack width="full" justifyContent="space-between">
                    <Button
                        variant="link"
                        colorScheme="purple"
                        size="sm"
                        onClick={() => setShowSpotifySearch(true)}
                    >
                        + Music
                    </Button>
                    <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="isPublic" mb="0" color="gray.800">
                            공개 여부
                        </FormLabel>
                        <Switch id="isPublic" isChecked={isPublic} onChange={() => setIsPublic(!isPublic)} />
                    </FormControl>
                </HStack>
                <AlertDialog
                    isOpen={showSpotifySearch}
                    leastDestructiveRef={cancelRef}
                    onClose={() => setShowSpotifySearch(false)} 
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                Music Search 
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                <SpotifySearch onSelectTrack={setSelectedTrack} />
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={() => setShowSpotifySearch(false)}>
                                    취소
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
                {selectedTrack && (
                    <>
                    <HStack spacing={4}>
                        <Image src={selectedTrack.album.images[0]?.url} alt={selectedTrack.name} boxSize="100px" borderRadius="md" />
                        <VStack align="start" spacing={1} flex="1">
                            <Text fontWeight="bold" fontSize="md">{selectedTrack.name}</Text>
                            <Text fontSize="sm" color="gray.500">by {selectedTrack.artists[0].name}</Text>
                            <audio controls src={selectedTrack.preview_url} style={{ width: '100%' }}></audio>
                        </VStack>
                    </HStack>
                    </>
                )}
                <Button type="submit" colorScheme="blue" width="full" size="sm">
                    Create Post
                </Button>
                {responseMessage && <Text color="red.500">{responseMessage}</Text>}
            </VStack>
        </Box>
    );
};

export default CreateBoardPost;

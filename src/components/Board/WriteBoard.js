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
    Grid,
    GridItem,
} from '@chakra-ui/react';
import { CloseIcon, EditIcon } from '@chakra-ui/icons';
import SpotifySearch from './SpotifySearch';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const CreateBoardPost = () => {
    const { currentUser } = useContext(AuthContext);
    const command = "write";
    const [contents, setContents] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [files, setFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [showSpotifySearch, setShowSpotifySearch] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files).slice(0, 4 - files.length); // 최대 4개 이미지 선택
        setFiles(prevFiles => [...prevFiles, ...selectedFiles]);

        const filePreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
        setFilePreviews(prevPreviews => [...prevPreviews, ...filePreviewUrls]);
    };

    const handleRemoveImage = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        const newFilePreviews = filePreviews.filter((_, i) => i !== index);

        setFiles(newFiles);
        setFilePreviews(newFilePreviews);
    };

    const uploadImages = async (boardCode) => {
        const uploadedImageUrls = [];
        for (const file of files) {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('boardCode', boardCode);

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/image/service`, {
                method: 'PUT',
                body: formData,
                credentials: 'include',
            });

            const data = await response.json();
            uploadedImageUrls.push(data.imageUrl);
        }
        return uploadedImageUrls;
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

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            const data = await response.json();
            const boardCode = data.boardCode;

            if (files.length > 0) {
                await uploadImages(boardCode);
            }

            setResponseMessage('Post created successfully!');
            navigate('/board/search');
        } catch (error) {
            setResponseMessage('Failed to create post.');
            console.error('There was an error!', error);
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
                    <FormLabel>Upload Photos (up to 4)</FormLabel>
                    <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                    />
                </FormControl>
                <Grid templateColumns="repeat(4, 1fr)" gap={2}>
                    {filePreviews.map((src, index) => (
                        <GridItem key={index} position="relative">
                            <Image src={src} alt={`preview ${index}`} boxSize="100px" objectFit="cover" />
                            <IconButton
                                icon={<CloseIcon />}
                                size="xs"
                                position="absolute"
                                top="2px"
                                right="2px"
                                onClick={() => handleRemoveImage(index)}
                            />
                        </GridItem>
                    ))}
                </Grid>
                <Heading textColor="black">내용</Heading>
                <FormControl id="contents" isRequired>
                    <Textarea
                        textColor="black"
                        placeholder="Placeholder"
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

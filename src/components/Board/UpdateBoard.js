import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';

const EditBoardPost = ({ boardCode }) => {
    const [contents, setContents] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [file, setFile] = useState(null);
    const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/board/${boardCode}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'ADMIN your_KEY',
                    },
                });
                const post = response.data;
                setContents(post.contents);
                setIsPublic(post.is_public);
            } catch (error) {
                console.error('There was an error fetching the post!', error);
            }
        };

        fetchPost();
    }, [boardCode]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        if (contents) formData.append('contents', contents);
        formData.append('is_public', isPublic);
        if (file) formData.append('file', file);

        try {
            const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/board/${boardCode}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                    'Authorization': 'ADMIN your_KEY',
                },
            });
            setResponseMessage('Post updated successfully!');
        } catch (error) {
            setResponseMessage('Failed to update post.');
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
            <VStack spacing={4} as="form" onSubmit={handleUpdate}>
                <FormControl id="file">
                    <FormLabel>Upload Photo</FormLabel>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </FormControl>
                <Heading>내용</Heading>
                <FormControl id="contents" isRequired>
                    <Textarea
                        placeholder="Placeholder"
                        value={contents}
                        onChange={(e) => setContents(e.target.value)}
                    />
                </FormControl>
                <HStack width="full" justifyContent="space-between">
                    <Button colorScheme="purple" variant="solid">
                        + Music
                    </Button>
                    <IconButton
                        icon={<EditIcon />}
                        colorScheme="purple"
                        variant="outline"
                        aria-label="Edit"
                    />
                </HStack>
 
                <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="isPublic" mb="0">
                        공개 여부
                    </FormLabel>
                    <Switch
                        id="isPublic"
                        isChecked={isPublic}
                        onChange={() => setIsPublic(!isPublic)}
                    />
                </FormControl>
                <Button type="submit" colorScheme="blue" width="full">
                    Update Post
                </Button>
                {responseMessage && <Text>{responseMessage}</Text>}
            </VStack>
        </Box>
    );
};

export default EditBoardPost;

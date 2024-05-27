import React, { useState } from 'react';
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

const CreateBoardPost = () => {
    const command = "write";
    const [contents, setContents] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [file, setFile] = useState(null);
    const [responseMessage, setResponseMessage] = useState('');

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json;charset=utf-8');
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        // const formData = new FormData();
        // formData.append('method', 'POST');
        // formData.append('command', command);
        // formData.append('contents', contents);
        // formData.append('is_public', isPublic);
        // if (file) {
        //     formData.append('file', file);
        // }

        try {
            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({
                    command: command,
                    contents: contents,
                    isPublic: isPublic,
                }),
                credentials: 'include',
            };



            fetch(`${process.env.REACT_APP_SERVER_URL}/board/service`, requestOptions, {
                // headers: {
                //     'Content-Type': '',
                //     'Accept': 'application/json',
                //     // 'Authorization': 'ADMIN your_KEY', // Ensure this is uncommented if needed
                // },
            });
            setResponseMessage('Post created successfully!');
        } catch (error) {
            setResponseMessage('Failed to create post.');
            console.error('There was an error!', error.response ? error.response.data : error.message);
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
                <FormControl id="file">
                    <FormLabel>Upload Photo</FormLabel>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </FormControl>
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
                {responseMessage && <Text textColor="red" >{responseMessage}</Text>}
            </VStack>
        </Box>
    );
};

export default CreateBoardPost;

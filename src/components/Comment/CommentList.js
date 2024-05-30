// CommentList.js
import React, { useState, useEffect, useContext } from 'react';
import {
    Box,
    Text,
    VStack,
    HStack,
    Textarea,
    Button,
    IconButton,
    useToast,
} from '@chakra-ui/react';
import AuthContext from '../../context/AuthContext';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

const CommentList = ({ boardCode }) => {
    const { currentUser } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editComment, setEditComment] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [error, setError] = useState('');
    const [showComments, setShowComments] = useState(false);
    const toast = useToast();
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json;charset=utf-8');

    useEffect(() => {
        if (showComments) {
            fetchComments();
        }
    }, [showComments]);

    const fetchComments = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/comment/service`, {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({ board_code: boardCode }),
            });
            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }
            const data = await response.json();
            setComments(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleAddComment = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/comment/service`, {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({
                    board_code: boardCode,
                    id: currentUser.id,
                    contents: newComment,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to add comment');
            }
            const data = await response.json();
            setComments(prevComments => [...prevComments, data]);
            setNewComment('');
            toast({
                title: 'Comment added',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            setError(error.message);
            toast({
                title: 'Error adding comment',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleEditComment = async (cmtCode) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/comment/service`, {
                method: 'PUT',
                headers: myHeaders,
                body: JSON.stringify({ contents: editContent }),
                cmtCode: cmtCode
            });
            if (!response.ok) {
                throw new Error('Failed to update comment');
            }
            const updatedComment = await response.json();
            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.cmt_code === cmtCode ? updatedComment : comment
                )
            );
            setEditComment(null);
            setEditContent('');
            toast({
                title: 'Comment updated',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            setError(error.message);
            toast({
                title: 'Error updating comment',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleDeleteComment = async (cmtCode) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/comment/service`, {
                method: 'DELETE',
                headers: myHeaders,
                body: JSON.stringify({
                    board_code: boardCode,
                    id: currentUser.id,
                    cmtCode: cmtCode
                })
            });
            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }
            setComments(prevComments => prevComments.filter(comment => comment.cmt_code !== cmtCode));
            toast({
                title: 'Comment deleted',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            setError(error.message);
            toast({
                title: 'Error deleting comment',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box mt={4}>
            <Button onClick={() => setShowComments(!showComments)}>
                {showComments ? 'Hide Comments' : 'Show Comments'}
            </Button>
            {showComments && (
                <>
                    {error && (
                        <Box color="red.500" mb={4}>
                            {error}
                        </Box>
                    )}
                    <VStack align="start" mt={4} spacing={4}>
                        {comments.map(comment => (
                            <Box key={comment.cmt_code} p={2} bg="gray.100" borderRadius="md" w="full">
                                <HStack justifyContent="space-between" w="full">
                                    <Box>
                                        <Text fontWeight="bold">{comment.id}</Text>
                                        {editComment === comment.cmt_code ? (
                                            <Textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                            />
                                        ) : (
                                            <Text>{comment.contents}</Text>
                                        )}
                                    </Box>
                                    {currentUser.id === comment.id && (
                                        <HStack>
                                            {editComment === comment.cmt_code ? (
                                                <Button onClick={() => handleEditComment(comment.cmt_code)}>Save</Button>
                                            ) : (
                                                <IconButton
                                                    icon={<EditIcon />}
                                                    onClick={() => {
                                                        setEditComment(comment.cmt_code);
                                                        setEditContent(comment.contents);
                                                    }}
                                                />
                                            )}
                                            <IconButton
                                                icon={<DeleteIcon />}
                                                onClick={() => handleDeleteComment(comment.cmt_code)}
                                            />
                                        </HStack>
                                    )}
                                </HStack>
                            </Box>
                        ))}
                        <HStack w="full" mt={2}>
                            <Textarea
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <Button onClick={handleAddComment}>Comment</Button>
                        </HStack>
                    </VStack>
                </>
            )}
        </Box>
    );
};

export default CommentList;

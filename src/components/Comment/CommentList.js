import React, { useState, useEffect, useContext } from 'react';
import {
    Box,
    Text,
    VStack,
    HStack,
    Input,
    Button,
    IconButton,
    useToast,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaSave, FaTimes, FaReply, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';

const CommentList = ({ boardCode }) => {
    const { currentUser } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentContent, setEditingCommentContent] = useState('');
    const [replyingCommentId, setReplyingCommentId] = useState(null);
    const [newReply, setNewReply] = useState('');
    const [showReplies, setShowReplies] = useState({});
    const toast = useToast();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/comment/service`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        command: "list",
                        boardCode: boardCode,
                    }),
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                }
                const data = await response.json();
                setComments(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchComments();
    }, [boardCode]);

    const handleAddComment = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/comment/service`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    command: "add",
                    id: currentUser.id,
                    contents: newComment,
                    boardCode: boardCode
                }),
            });

            console.log('Response status:', response.status);
            const responseText = await response.text();
            console.log('Response text:', responseText);

            let result;
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                // JSON 파싱에 실패한 경우
                if (response.ok) {
                    toast({
                        title: "댓글이 작성되었습니다.",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                } else {
                    toast({
                        title: "댓글 작성 실패",
                        description: responseText,
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                }
                return; // 파싱 실패 시 여기서 함수 종료
            }

            if (response.ok) {
                setNewComment('');
                setComments((prevComments) => [...prevComments, result]);
                toast({
                    title: "댓글이 작성되었습니다.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                throw new Error(result.message || 'Failed to add comment');
            }
        } catch (error) {
            console.error(error);
            toast({
                title: error.message || "댓글 작성 실패",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleAddReply = async (parentCode) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/comment/service`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    command: "add",
                    id: currentUser.id,
                    contents: newReply,
                    boardCode: boardCode,
                    parent: parentCode,
                }),
            });

            const responseText = await response.text();
            console.log('Response text:', responseText);

            let result;
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                if (response.ok) {
                    toast({
                        title: "답글이 작성되었습니다.",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                } else {
                    toast({
                        title: "답글 작성 실패",
                        description: responseText,
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                }
                return;
            }

            if (response.ok) {
                setNewReply('');
                setComments((prevComments) => [...prevComments, result]);
                toast({
                    title: "답글이 작성되었습니다.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                throw new Error(result.message || 'Failed to add reply');
            }
        } catch (error) {
            console.error(error);
            toast({
                title: error.message || "답글 작성 실패",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleEditComment = async (cmtCode) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/comment/service`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    command: "edit",
                    cmtCode: cmtCode,
                    contents: editingCommentContent,
                }),
            });

            const responseText = await response.text();
            console.log('Response text:', responseText);

            let result;
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                if (response.ok) {
                    toast({
                        title: "댓글이 수정되었습니다.",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                } else {
                    toast({
                        title: "댓글 수정 실패",
                        description: responseText,
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                }
                return;
            }

            if (response.ok) {
                setEditingCommentId(null);
                setEditingCommentContent('');
                const updatedComments = comments.map(comment =>
                    comment.cmtCode === cmtCode ? { ...comment, contents: editingCommentContent } : comment
                );
                setComments(updatedComments);
                toast({
                    title: "댓글이 수정되었습니다.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                throw new Error(result.message || 'Failed to edit comment');
            }
        } catch (error) {
            console.error(error);
            toast({
                title: error.message || "댓글 수정 실패",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleDeleteComment = async (cmtCode) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/comment/service`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    command: "delete",
                    cmtCode: cmtCode,
                }),
            });

            const responseText = await response.text();
            console.log('Response text:', responseText);

            let result;
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                if (response.ok) {
                    toast({
                        title: "댓글이 삭제되었습니다.",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                } else {
                    toast({
                        title: "댓글 삭제 실패",
                        description: responseText,
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                }
                return;
            }

            if (response.ok) {
                setComments(comments.filter(comment => comment.cmtCode !== cmtCode));
                toast({
                    title: "댓글이 삭제되었습니다.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                throw new Error(result.message || 'Failed to delete comment');
            }
        } catch (error) {
            console.error(error);
            toast({
                title: error.message || "댓글 삭제 실패",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const toggleReplies = (commentId) => {
        setShowReplies((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    const renderReplies = (parentCode) => {
        return comments
            .filter(comment => comment.parent === parentCode)
            .map(reply => (
                <Box key={reply.cmtCode} p={2} pl={8} borderWidth={1} borderRadius="md" mt={2}>
                    <HStack justifyContent="space-between">
                        {editingCommentId === reply.cmtCode ? (
                            <>
                                <Input
                                    value={editingCommentContent}
                                    onChange={(e) => setEditingCommentContent(e.target.value)}
                                />
                                <IconButton
                                    icon={<FaSave />}
                                    onClick={() => handleEditComment(reply.cmtCode)}
                                />
                                <IconButton
                                    icon={<FaTimes />}
                                    onClick={() => {
                                        setEditingCommentId(null);
                                        setEditingCommentContent('');
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                <Text>{reply.contents}</Text>
                                <HStack>
                                    {currentUser.id === reply.id && (
                                        <>
                                            <IconButton
                                                icon={<FaEdit />}
                                                onClick={() => {
                                                    setEditingCommentId(reply.cmtCode);
                                                    setEditingCommentContent(reply.contents);
                                                }}
                                            />
                                            <IconButton
                                                icon={<FaTrash />}
                                                onClick={() => handleDeleteComment(reply.cmtCode)}
                                            />
                                        </>
                                    )}
                                </HStack>
                            </>
                        )}
                    </HStack>
                </Box>
            ));
    };

    return (
        <VStack align="stretch" spacing={4} mt={4}>
            {comments.filter(comment => comment.parent === 0).map(comment => (
                <Box key={comment.cmtCode} p={2} borderWidth={1} borderRadius="md">
                    <HStack justifyContent="space-between">
                        {editingCommentId === comment.cmtCode ? (
                            <>
                                <Input
                                    value={editingCommentContent}
                                    onChange={(e) => setEditingCommentContent(e.target.value)}
                                />
                                <IconButton
                                    icon={<FaSave />}
                                    onClick={() => handleEditComment(comment.cmtCode)}
                                />
                                <IconButton
                                    icon={<FaTimes />}
                                    onClick={() => {
                                        setEditingCommentId(null);
                                        setEditingCommentContent('');
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                <Text>{comment.contents}</Text>
                                <HStack>
                                    {currentUser.id === comment.id && (
                                        <>
                                            <IconButton
                                                icon={<FaEdit />}
                                                onClick={() => {
                                                    setEditingCommentId(comment.cmtCode);
                                                    setEditingCommentContent(comment.contents);
                                                }}
                                            />
                                            <IconButton
                                                icon={<FaTrash />}
                                                onClick={() => handleDeleteComment(comment.cmtCode)}
                                            />
                                        </>
                                    )}
                                    <IconButton
                                        icon={<FaReply />}
                                        onClick={() => setReplyingCommentId(comment.cmtCode)}
                                    />
                                    <Button
                                        size="sm"
                                        variant="link"
                                        onClick={() => toggleReplies(comment.cmtCode)}
                                        rightIcon={showReplies[comment.cmtCode] ? <FaChevronUp /> : <FaChevronDown />}
                                    >
                                        댓글 {comments.filter(c => c.parent === comment.cmtCode).length}개
                                    </Button>
                                </HStack>
                            </>
                        )}
                    </HStack>
                    {replyingCommentId === comment.cmtCode && (
                        <Box mt={2}>
                            <Input
                                placeholder="대댓글을 입력하세요"
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
                            />
                            <Button onClick={() => handleAddReply(comment.cmtCode)} mt={2}>
                                Add Reply
                            </Button>
                        </Box>
                    )}
                    {showReplies[comment.cmtCode] && renderReplies(comment.cmtCode)}
                </Box>
            ))}
            <HStack>
                <Input
                    placeholder="댓글을 입력하세요"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <Button onClick={handleAddComment}>Add Comment</Button>
            </HStack>
        </VStack>
    );
};

export default CommentList;

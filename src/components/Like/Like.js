import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, IconButton, Image, Text } from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { BiLike, BiChat, BiShare } from 'react-icons/bi';
import Header from '../module/Header';
import Footer from '../module/Footer';

const Like = () => {
    let [likeCount, setLikeCount] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        const board_code = 2;
        const command = "likeAdd";
        const id = "user5";
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json;charset=utf-8');

        const requestOptions = {
            method : 'PUT',
            headers : myHeaders,
            body : JSON.stringify({
                command : command,
                id : id,
                board_code : board_code,
            })
        };

        fetch(`${process.env.REACT_APP_SERVER_URL}/like`,requestOptions)
        .then((response) => {
            return response.text().then((result) =>{
                if(response.ok){
                    console.log('좋아요처리  성공:',result);
                    setLikeCount(prevCount => prevCount + 1);
                }else{
                    console.log('왜인지 실패');
                }
            });
        }).catch((error) =>{
            console.log('실패처리');
        })
        console.log(board_code, command, id);
    }

    return (
        <>
            <Header />
            <Card maxW='md'>
                <CardHeader>
                    <Flex spacing='4'>
                        <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                            <Avatar name='Segun Adebayo' src='https://bit.ly/sage-adebayo' />
                            <Box>
                                <Heading size='sm'>이름</Heading>
                                <Text>설명</Text>
                            </Box>
                        </Flex>
                        <IconButton
                            variant='ghost'
                            colorScheme='gray'
                            aria-label='See menu'
                            icon={<BsThreeDotsVertical />}
                        />
                    </Flex>
                </CardHeader>
                <CardBody>
                    <Text>
                        내용
                    </Text>
                </CardBody>
                <Image
                    objectFit='cover'
                    src='https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                    alt='Chakra UI'
                />
                <CardFooter
                    justify='space-between'
                    flexWrap='wrap'
                    sx={{
                        '& > button': {
                            minW: '136px',
                        },
                    }}
                >
                    <Button type='button' flex='1' variant='ghost' leftIcon={<BiLike />} onClick={handleSubmit} value={2}>
                    <Text>{likeCount}</Text>Like
                    </Button>
                    <Button flex='1' variant='ghost' leftIcon={<BiChat />}>
                        Comment
                    </Button>
                    <Button flex='1' variant='ghost' leftIcon={<BiShare />}>
                        Share
                    </Button>
                </CardFooter>
            </Card>

            
            <Footer />
        </>
    );
};

export default Like;

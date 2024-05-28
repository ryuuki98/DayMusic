import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, IconButton, Image, Table, TableContainer, Tbody, Td, Text, Th } from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { BiLike, BiChat, BiShare } from 'react-icons/bi';
import Header from '../module/Header';
import Footer from '../module/Footer';
import { Thead, Tr } from '@chakra-ui/react';
const Like = () => {
    let [likeCount, setLikeCount] = useState(0);
    let [likeList, setLikeList] = useState([]);
    const handleSubmit = (e) => {
        e.preventDefault();
        const board_code = 2;
        const command = 'likeAdd';
        const id = 'user5';
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json;charset=utf-8');

        const requestOptions = {
            method : 'POST',
            headers : myHeaders,
            body : JSON.stringify({
                command: command,
                id: id,
                board_code: board_code,
            }),
        };
        
        console.log("요청 보낼 내용:", requestOptions);
        
        fetch(`${process.env.REACT_APP_SERVER_URL}/like`, requestOptions)
        .then((response) => {
            return response.json().then((data) =>{
                const count = data.count;
                if(response.ok){
                    console.log('좋아요처리  성공:',count);
                    setLikeCount(count);
                }else{
                    console.log('왜인지 실패');
                }
            });
        }).catch((error) =>{
            console.log('실패처리');
        });
        
    }
    const listSubmit = (e) => {
        e.preventDefault();
        const board_code = 2;
        const command = 'like';
        
        fetch(`${process.env.REACT_APP_SERVER_URL}/like?command=${command}&board_code=${board_code}`, {
            method: 'GET',
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            setLikeList(data);
        })
        .catch(error => {
            console.log('요청 실패:', error);
        });
    };
    
    
    

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
                    <Button flex='1' variant='ghost' leftIcon={<BiChat />} onClick={listSubmit} value={2}>
                        좋아요 누른 유저
                    </Button>
                    <Button flex='1' variant='ghost' leftIcon={<BiChat />}>
                        Comment
                    </Button>
                    <Button flex='1' variant='ghost' leftIcon={<BiShare />}>
                        Share
                    </Button>
                </CardFooter>
            </Card>
            <Box>
                <TableContainer>
                <Table variant={"striped"} colorScheme="blackAlpha">
                    <Thead>
                        <Tr>
                            <Th>
                                프로필
                            </Th>
                            <Th>
                                닉네임
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {likeList.map((list,index) =>(
                            <>
                                <Tr>
                                    <Td>
                                        {list.profileImgUrl}
                                    </Td>
                                    <Td>
                                        {list.nickname}
                                    </Td>
                                </Tr>
                            </>
                        ))}

                    </Tbody>
                    </Table>
                </TableContainer>
            </Box>

            
            <Footer />
        </>
    );
};

export default Like;

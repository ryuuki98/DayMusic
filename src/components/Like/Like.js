import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, IconButton, Image, Text } from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { BiLike, BiChat, BiShare } from 'react-icons/bi';
import Header from '../module/Header';
import Footer from '../module/Footer';

const Like = () => {
    const test = (e) => {
        const board_code = e.target.value;
        const command = "like";
        window.location.href = `${process.env.REACT_APP_SERVER_URL}/like?command=${command}&board_code=${board_code}`;
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
                    <Button flex='1' variant='ghost' leftIcon={<BiLike />} onClick={test} value={2}>
                        Like
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

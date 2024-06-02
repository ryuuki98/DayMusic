import React, { useContext, useEffect, useState } from 'react';
import Header from '../module/Header';
import AuthContext from '../../context/AuthContext';
import { Box, VStack, HStack, Image, Text, Alert, AlertIcon, Center, Flex } from '@chakra-ui/react';
import Sidebar from '../module/SideBar';

const Rank = () => {
    const [rank, setRank] = useState([]);
    const [error, setError] = useState('');
    const command = "rank";
    const { currentUser } = useContext(AuthContext);
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json;charset=utf-8');

    useEffect(() => {
        const fetchRank = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/rank`, {
                    method: 'POST',
                    headers: myHeaders,
                    body: JSON.stringify({
                        command: command,
                    }),
                });
                const responseJSON = await response.json();

                if (!response.ok) {
                    throw new Error("데이터를 가져오는데 실패했습니다!");
                }
                console.log(responseJSON);
                setRank(responseJSON);
            } catch (error) {
                setError("데이터를 가져오는데 실패했습니다!");
            }
        };

        fetchRank();
    }, []);

    if (error) {
        return (
            <Center py={10}>
                <Alert status="error">
                    <AlertIcon />
                    {error}
                </Alert>
            </Center>
        );
    }

    return (
        <>
            <Header />
            <Flex>
                <Box as="aside" width="200px">
                    <Sidebar />
                </Box>
                <Center p={5} flexDirection="column" flex="1">
                    {rank.map((list, index) => (
                        <Flex key={index} mb={5} p={5} borderWidth="1px" borderRadius="lg" width="80%" justifyContent="space-between" alignItems="center">
                            <VStack align="start">
                                <Text fontSize="2xl" fontWeight="bold">{index + 1}. {list.musicTrack}</Text>
                                <Text fontSize="md" color="gray.500">{list.musicArtist}</Text>
                            </VStack>
                            <HStack spacing={4}>
                                <Image src={list.musicThumbnail} alt={`${list.musicTrack} thumbnail`} boxSize="50px" borderRadius="md" />
                                <audio controls src={list.musicPreviewUrl} style={{ width: '200px' }}></audio>
                            </HStack>
                        </Flex>
                    ))}
                </Center>
            </Flex>
        </>
    );
};

export default Rank;

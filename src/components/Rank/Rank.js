import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import { Box, VStack, HStack, Image, Text, Alert, AlertIcon, Center, Flex, Badge, Icon, Button } from '@chakra-ui/react';
import { AiFillLike } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const Rank = () => {
    const [rank, setRank] = useState([]);
    const [error, setError] = useState('');
    const command = "rank";
    const { currentUser } = useContext(AuthContext);
    const [todayCount, setTodayCount] = useState(0);
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
                todaySetting(responseJSON);
            } catch (error) {
                setError("데이터를 가져오는데 실패했습니다!");
            }
        };

        fetchRank();
    }, []);

    const todaySetting = (responseJSON) => {
        const data = responseJSON;
        let count = 0;
        data.map((list) =>{
            count += list.count;
        })
        setTodayCount(count);
    }

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
        <Box p={5}>

            <Center flexDirection="column">
            <Text fontSize={"5xl"} margin={"50px"}>오늘은 총 {todayCount}곡이 포스팅 되었습니다.</Text>

                {rank.map((list, index) => (
                    <Box
                        key={index}
                        mb={4}
                        p={4}
                        borderRadius="lg"
                        width="100%"
                        maxW="800px"
                        bg="white"
                        boxShadow="md"
                    >
                        <Flex justifyContent="space-between" alignItems="center">
                            <VStack align="start">
                                <Text fontSize="2xl" fontWeight="bold">{index + 1}. {list.musicTrack}</Text>
                                <Text fontSize="md" color="gray.500">{list.musicArtist}</Text>
                                <HStack>
                                    <Badge fontSize="md">
                                        <Icon as={AiFillLike} mr={1} />
                                        {list.count}
                                    </Badge>
                                    <Link to={list.musicUrl}>
                                        <Button size="sm" variant="outline">스포티파이 이동</Button>
                                    </Link>
                                </HStack>
                            </VStack>
                            <HStack spacing={4}>
                                <Image src={list.musicThumbnail} alt={`${list.musicTrack} thumbnail`} boxSize="75px" borderRadius="md" />
                                <audio controls src={list.musicPreviewUrl} style={{ width: '200px' }}></audio>
                            </HStack>
                        </Flex>
                    </Box>
                ))}
            </Center>
        </Box>
    );
};

export default Rank;

import React, { useContext, useEffect, useState } from 'react';
import { Box, Image, Text, VStack, HStack, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import AuthContext from '../../context/AuthContext';

const SideRankBar = () => {
    const [rank, setRank] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const command = "sideRank";

    const { currentUser } = useContext(AuthContext);

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json;charset=utf-8');

    useEffect(() => {
        const fetchSideRank = async () => {
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
                    throw new Error("데이터를 가져오는데 실패했습니다.");
                }
                setRank(responseJSON.slice(0, 5)); // 상위 5개의 노래로 제한
                setLoading(false);
            } catch (error) {
                setError("데이터를 가져오는데 실패했습니다.");
                setLoading(false);
            }
        }

        fetchSideRank();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <Alert status="error">
                <AlertIcon />
                {error}
            </Alert>
        );
    }

    return (
        <Box position="fixed" top="50%" right="50px" transform="translateY(-50%)" p={4} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white" w="200px">
            <VStack align="start" spacing={4}>
                {rank.map((list, index) => (
                    <HStack key={index} w="full" align="center">
                        <Image boxSize="50px" src={list.musicThumbnail} alt={list.musicTrack} borderRadius="md" />
                        <VStack align="start" spacing={1}>
                            <Text fontWeight="bold" noOfLines={1}>{index + 1}.{list.musicTrack}</Text>
                            <Text fontSize="sm" color="gray.500" noOfLines={1}>{list.musicArtist}</Text>
                        </VStack>
                    </HStack>
                ))}
            </VStack>
        </Box>
    );
};

export default SideRankBar;

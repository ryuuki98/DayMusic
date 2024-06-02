import React, { useEffect, useState } from 'react';
import { Input, Button, VStack, List, ListItem, Text } from '@chakra-ui/react';
import { getSpotifyToken } from '../../utils/spotifyAuth';

const SpotifySearch = ({ onSelectTrack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [tracks, setTracks] = useState([]);
    const [token, setToken] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const newToken = await getSpotifyToken();
                setToken(newToken);
            } catch (error) {
                setErrorMessage('Error fetching token.');
                console.error('Error fetching token:', error);
            }
        };

        fetchToken();
    }, []);

    const searchTracks = async () => {
        try {
            const response = await fetch(`https://api.spotify.com/v1/search?q=${searchTerm}&type=track`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            console.log(data);
            if (data.tracks) {
                setTracks(data.tracks.items);
                setErrorMessage('');
            } else {
                setTracks([]);
                setErrorMessage('No tracks found.');
            }
        } catch (error) {
            setErrorMessage('Error fetching tracks. Please try again.');
            console.error('Error fetching tracks:', error);
        }
    };

    return (
        <VStack spacing={4} width="full">
            <Input
                textColor="black"
                placeholder="Search for a track"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button onClick={searchTracks} colorScheme="green">
                검색
            </Button>
            {errorMessage && <Text color="red">{errorMessage}</Text>}
            <List spacing={2} width="full">
                {tracks.map((track) => (
                    <ListItem
                        key={track.id}
                        onClick={() => onSelectTrack(track)}
                        cursor="pointer"
                        _hover={{ bg: 'gray.100' }}
                        p={2}
                    >
                        <Text>
                            {track.name} by {track.artists[0].name}
                        </Text>
                    </ListItem>
                ))}
            </List>
        </VStack>
    );
};

export default SpotifySearch;
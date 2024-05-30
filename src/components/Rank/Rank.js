import React, { useEffect, useState } from 'react';
import Header from '../module/Header';
import { getSpotifyToken } from '../../utils/spotifyAuth';

const Rank = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [query, setQuery] = useState('');
    const [error, setError] = useState(null);

    const fetchSearchResults = async () => {
        try {
            const token = await getSpotifyToken();
            const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const searchData = await searchResponse.json();
            if (searchData.tracks) {
                setSearchResults(searchData.tracks.items);
            } else {
                setSearchResults([]);
                console.error('Unexpected API response:', searchData);
            }
        } catch (err) {
            setError('Failed to fetch search results');
            console.error('Error fetching search results:', err);
        }
    };

    useEffect(() => {
        if (query) {
            fetchSearchResults();
        }
    }, [query]);

    const XxV?VXvx?zxhandleSearch = (event) => {
        setQuery(event.target.value);
    };

    return (
        <>
            <Header />
            <div>
                <h1>Spotify 검색</h1>
                <input type="text" value={query} onChange={handleSearch} placeholder="트랙 검색" />
                {error && <p>{error}</p>}
                {searchResults.length > 0 ? (
                    <ul>
                        {searchResults.map((track) => (
                            <li key={track.id}>
                                {track.name} by {track.artists.map((artist) => artist.name).join(', ')}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>결과를 찾을 수 없습니다</p>
                )}
            </div>
        </>
    );
};

export default Rank;

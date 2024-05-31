import React, { useState } from 'react';
import { getSpotifyToken } from '../../utils/spotifyAuth';

const FindMusic = (getMusic) => {
    const [music, setMusic] = useState('');
    const [token, setToken] = useState([]);

    const searchMusic = async () =>{
        if(!token){
            const newToken = await getSpotifyToken();
            setToken(newToken);
        }
    }

    return (
        <>

        </>
    );
};

export default FindMusic;
import { Box } from '@chakra-ui/react';
import React from 'react';

const Main = () => {
    return (
        <Box>
            <h4>Main!!</h4>
            <form method='POST'
            action={`${process.env.REACT_APP_SERVER_URL}/user/service`}
            >
                <input type='hidden' id='command' name='command' value="like" />
                <input type='submit' />
            </form>
        </Box>
    );
};

export default Main;

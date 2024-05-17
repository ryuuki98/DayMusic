import { Box } from '@chakra-ui/react';
import React from 'react';

const Main = () => {
    return (
        <>
            <Box>
                <h4>Main</h4>
                <form method="POST" action={`http://192.168.10.178:8080/user/service`}>
                    <input type="hidden" id="command" name="command" value="test" />
                    <input type="submit" />
                </form>
            </Box>
        </>
    );
};

export default Main;
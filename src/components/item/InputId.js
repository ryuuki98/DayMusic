import React from 'react';
import { Input } from '@chakra-ui/react';

const InputId = () => {
    return (
        <Input 
            id="id-input"
            name='id'
            type="text" 
            placeholder="아이디 입력" 
        />
    );
};

export default InputId;

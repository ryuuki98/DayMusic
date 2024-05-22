import React, { useState } from 'react';
import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react';

const InputPassword = () => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    return (
        <InputGroup size="md" >
            <Input 
                id="password-input"
                name='password'
                pr="4.5rem" 
                type={show ? 'text' : 'password'} 
                placeholder="비밀번호 입력"
            />
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? 'Hide' : 'Show'}
                </Button>
            </InputRightElement>
        </InputGroup>
    );
};

export default InputPassword;

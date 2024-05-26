import React, { useState } from 'react';
import {
    FormControl,
    FormLabel,
    Input,
    FormHelperText,
} from '@chakra-ui/react';

const InputField = ({ id, label, type = 'text', value, onChange, placeholder, isRequired = false, validate }) => {
    const [error, setError] = useState('');

    const handleBlur = async () => {
        if (validate) {
            const errorMessage = await validate(value);
            setError(errorMessage);
        }
    };

    return (
        <FormControl id={id} isRequired={isRequired} mt={4}>
            <FormLabel>{label}</FormLabel>
            <Input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                onBlur={handleBlur}
            />
            {error && <FormHelperText color="red.500">{error}</FormHelperText>}
        </FormControl>
    );
};

export default InputField;

import { Box, Text, border } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Image } from '@chakra-ui/react';

const UploadImage = () => {
    const [imgUrl, setImgUrl] = useState({
        border_code: 2,
        image_url: '',
        image_path: '',
        image_name: '',
        image_type: '',
    });

    const onChangeImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImgUrl({
                image_url: reader.result,
                image_path: file.name,
                image_name: '',
                image_type: '',
            });
        }
    }

    return (
        <>
            <Box>
                <Text as="h1">이미지 테스트</Text>
                <input type="file" onChange={onChangeImageUpload} accept="image/*" />
                {imgUrl && (
                    <Box boxSize='sm'>
                        <Image src={imgUrl} alt='Uploaded Image' />
                    </Box>
                )}
            </Box>
        </>
    );
};

export default UploadImage;

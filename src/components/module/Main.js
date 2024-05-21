import { Box } from '@chakra-ui/react';
import React from 'react';

const Main = () => {
    return (
        <>
            <Box>
                <h4>Main</h4>
                <div id = "image-container"></div>
                <form
                    method="POST"
                    action={`${process.env.REACT_APP_SERVER_URL}/user/service`}
                    encType="multipart/form-data"
                >
                    <input type="hidden" id="command" name="command" value="test" />
                    <input
                        type="file"
                        id="file"
                        name="file"
                        onChange={(e) => {
                            console.log(e.target.files);
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.onload = (f) => {
                                console.log(f.target);
                                const dataUrl = f.target.result;
                                document.getElementById("image-container").innerHTML = `<img src = ${dataUrl}>`;
                            };
                            reader.readAsDataURL(file);
                        }}
                    />
                    <input type="submit" />
                </form>
            </Box>
        </>
    );
};

export default Main;

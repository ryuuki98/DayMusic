import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import AuthProvider from './context/AuthProvider';

// Create a theme configuration
const config = {
    initialColorMode: 'light',
    useSystemColorMode: false,
};

// Extend the theme with the configuration
const theme = extendTheme({ config });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
    <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <AuthProvider>
            <App />
        </AuthProvider>
    </ChakraProvider>
    // </React.StrictMode>
);

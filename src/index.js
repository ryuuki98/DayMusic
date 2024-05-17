import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider, Grid } from '@chakra-ui/react';
import Header from './components/module/Header';
import Footer from './components/module/Footer';
import Main from './components/module/Main';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ChakraProvider>
            <Grid templateRows={"160px auto 100px"} minH={"100vh"}>
            <Header/>
            <Main/>
            <App />
            <Footer/>
            </Grid>
        </ChakraProvider>
    </React.StrictMode>
);
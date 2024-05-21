import React from 'react';
import Header from './module/Header';
import Footer from './module/Footer';
import { Outlet } from 'react-router-dom';

const Root = () => {
    return (
        <>
            <Header />
            <Outlet />
            <Footer/>
        </>
    );
};

export default Root;

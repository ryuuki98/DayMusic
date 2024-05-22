import React from 'react';
import Header from './module/Header';
import { Outlet } from 'react-router-dom';
import Footer from './module/Footer';

const Board = () => {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
};

export default Board;
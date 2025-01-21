import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import Navbar from './Components/Navbar';
import SideBar from './Components/Sidebar';
import Home from './Pages/home';
import Settings from './Pages/settings';

const drawerWidth = 240;

export default function App() {
    const [open, setOpen] = useState(true);
    const isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        if (isMobile) {
            setOpen(false);
        }
    }, [isMobile]);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <Router>
            <Navbar open={open} />
            <div style={{ display: 'flex' }}>
                <SideBar open={open} toggleDrawer={toggleDrawer} />
                <main style={{
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                    marginTop: '64px',
                    width: `calc(100% - ${open ? drawerWidth : 64}px)`,
                    paddingLeft: '20px', // Konstanter Abstand statt margin
                    transition: 'width 0.3s',
                }}>
                    <Routes>
                        <Route path="/" element={<Home/>} />
                        <Route path="/settings" element={<Settings/>} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}
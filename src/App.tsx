import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import Navbar from './Components/Navbar';
import SideBar from './Components/Sidebar';

// Routes
import Home from './Pages/home';
import Settings from './Pages/settings';
import Vm from './Pages/vm';
import Login from './Pages/login';

const drawerWidth = 240;

export default function App() {
    const [open, setOpen] = useState(true);
    const isMobile = useMediaQuery('(max-width:600px)');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (isMobile) {
            setOpen(false);
        }
    }, [isMobile]);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token);
        };

        // Initial check
        checkAuth();

        // Listen for custom event
        window.addEventListener('localStorageChanged', checkAuth);
        // Listen for changes from other tabs
        window.addEventListener('storage', checkAuth);
        
        return () => {
            window.removeEventListener('localStorageChanged', checkAuth);
            window.removeEventListener('storage', checkAuth);
        };
    }, []);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <Router>
            {isLoggedIn ? (
                <>
                    <Navbar open={open} />
                    <div style={{ display: 'flex' }}>
                        <SideBar open={open} toggleDrawer={toggleDrawer} />
                        <main style={{
                            flexGrow: 1,
                            height: '100vh',
                            overflow: 'auto',
                            marginTop: '64px',
                            width: `calc(100% - ${open ? drawerWidth : 64}px)`,
                            paddingLeft: '20px',
                            transition: 'width 0.3s',
                        }}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/vm" element={<Vm />} />
                                <Route path="/settings" element={<Settings />} />
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </main>
                    </div>
                </>
            ) : (
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            )}
        </Router>
    );
}
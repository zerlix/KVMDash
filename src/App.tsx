import { useState, useEffect, JSX } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useMediaQuery, Box } from '@mui/material';

import SideBar from './components/Sidebar';

// Routes
import Login from './pages/login';
import Home from './pages/home';
//import Vm from './Pages/vm';
//import VmDetailsPage from './Pages/vmDetails';
//import Settings from './Pages/settings';

import { layoutStyles } from './Theme';


export default function App(): JSX.Element {

    const [open, setOpen] = useState(true);
    const isMobile = useMediaQuery('(max-width:600px)');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (isMobile) {
            setOpen(false);
        }
    }, [isMobile]);

    useEffect(() => {
        const checkAuth = (): void => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token);
        };

        // Initial check
        checkAuth();

        // Listen for custom event
        window.addEventListener('localStorageChanged', checkAuth);
        // Listen for changes from other tabs
        window.addEventListener('storage', checkAuth);

        const cleanup = (): void => {
            window.removeEventListener('localStorageChanged', checkAuth);
            window.removeEventListener('storage', checkAuth);
        };

        return cleanup;
    }, []);

    const toggleDrawer = (): void => {
        setOpen(!open);
    };

    return (
        <Router>
            {isLoggedIn ? (
                <>
                    <Box sx={{ display: 'flex' }}>
                        <SideBar open={open} toggleDrawer={toggleDrawer} />
                        <main style={{
                            ...layoutStyles.mainContent,
                            width: layoutStyles.mainContent.width(open)
                        }}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="*" element={<Navigate to="/" />} />
                                {/*
                                <Route path="/vm" element={<Vm />} />
                                <Route path="/vm/:vmName" element={<VmDetailsPage />} />
                                <Route path="/settings" element={<Settings />} />
                                 */}
                            </Routes>
                        </main>
                    </Box>
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
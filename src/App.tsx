import { useState, useEffect, JSX } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';

import SideBar from './components/Sidebar';
//import VmDetailsPage from './Pages/vmDetails';

// Routes
//import Home from './Pages/home';
//import Settings from './Pages/settings';
//import Vm from './Pages/vm';
import Login from './pages/login';

const drawerWidth = 240;

export default function App(): JSX.Element{
    
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
                    <div style={{ display: 'flex' }}>
                        <SideBar open={open} toggleDrawer={toggleDrawer} />
                        <main style={{
                            flexGrow: 1,
                            overflow: 'auto',
                            marginTop: '64px',
                            width: `calc(100% - ${open ? drawerWidth : 64}px)`,
                            paddingLeft: '20px',
                            transition: 'width 0.3s',
                        }}>
                            {/* 
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/vm" element={<Vm />} />
                                <Route path="/vm/:vmName" element={<VmDetailsPage />} />
                                <Route path="/settings" element={<Settings />} />
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes> 
                            */}
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
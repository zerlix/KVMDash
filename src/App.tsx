import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import SideBar from './Components/Sidebar';
import Home from './Dashboard/home';
import Settings from './Dashboard/settings';

const drawerWidth = 240;

export default function App() {
    const [open, setOpen] = useState(true);

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
                        <Route path="/" element={<Home open={open} />} />
                        <Route path="/settings" element={<Settings open={open} />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}
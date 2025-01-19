import React, { useState } from 'react';

import Navbar from './Components/Navbar';
import SideBar from './Components/Sidebar';
import Dashboard from './Dashboard';

const drawerWidth = 240;

export default function App() {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <Navbar open={open} />
      <div style={{ display: 'flex' }}>
        <SideBar open={open} toggleDrawer={toggleDrawer} />
        <main style={{ 
                flexGrow: 1, 
                height: '100vh', 
                overflow: 'auto',
                marginTop: '64px',
                width: `calc(100% - ${open ? drawerWidth : 0}px)`,
                paddingLeft: '20px', // Konstanter Abstand statt margin
                transition: 'width 0.3s',
        }}>
            <Dashboard open={open} />
        </main>
      </div>
    </>
  );
}
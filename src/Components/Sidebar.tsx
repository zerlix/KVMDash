import React from 'react';
import Drawer from '@mui/material/Drawer';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Divider, Toolbar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import KvmLogo from '../assets/kvmdash.svg';  


const drawerWidth = 240;

interface SidebarProps {
    open: boolean;
    toggleDrawer: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, toggleDrawer }) => {
    return (

        
        <Drawer
            variant="permanent"
            anchor="left"
            open={open}
            sx={{
                width: open ? drawerWidth : '64px',
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: open ? drawerWidth : '64px',
                    boxSizing: 'border-box',
                    overflowX: 'hidden',
                    transition: 'width 0.3s',
                    boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.5)',
                },
            }}
        >
             {/* Toolbar mit Logo */}
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <img src={KvmLogo} alt="Logo" style={{ width: '100%', maxWidth: '50px', height: 'auto' }} />
            </Toolbar>

            <Divider />

             {/* Drawer Close Icon */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px' }}>
                <IconButton onClick={toggleDrawer}>
                    {open ? <ChevronLeftIcon /> : <MenuIcon />}
                </IconButton>
            </div>
            
            {/* Menubar */}
            <List>

                {/* Home Link */}
                <ListItem key="home" disablePadding>
                    <ListItemButton sx={{ justifyContent: open ? 'initial' : 'center' }}>
                        <ListItemIcon sx={{ minWidth: open ? 48 : 0 }}>
                            <HomeIcon />
                        </ListItemIcon>
                        {open && <ListItemText primary="Home" />}
                    </ListItemButton>
                </ListItem>
            
                {/* Settings Links */}
                <ListItem key="settings" disablePadding>
                    <ListItemButton sx={{ justifyContent: open ? 'initial' : 'center' }}>
                        <ListItemIcon sx={{ minWidth: open ? 48 : 0 }}>
                            <SettingsIcon />
                        </ListItemIcon>
                        {open && <ListItemText primary="Settings" />}
                    </ListItemButton>
                </ListItem>
            
            </List>

        </Drawer>
    );
};

export default Sidebar;
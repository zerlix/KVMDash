import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Divider, Toolbar, Collapse } from '@mui/material';

// MUI 
import Drawer from '@mui/material/Drawer';

// MUI Icons
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import ComputerIcon from '@mui/icons-material/Computer';
import StorageIcon from '@mui/icons-material/Storage';

// KVMDash Logo
import KvmLogo from '../assets/kvmdash.svg';

import { fetchVmList } from '../services/vmService';

const drawerWidth = 240;

interface SidebarProps {
    open: boolean;
    toggleDrawer: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, toggleDrawer }) => {
    const [openVm, setOpenVm] = useState(false);
    const [vmList, setVmList] = useState<any[]>([]);
    const [error, setError] = useState<string>('');

    const handleVmClick = (): void => {
        if (!open) {
            toggleDrawer(); // Sidebar ausfahren, wenn sie geschlossen ist
        }
        setOpenVm(!openVm);
    };

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                const data = await fetchVmList();
                setVmList(data);
            } catch (err: any) {
                setError(err.message);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return (): void => clearInterval(interval);
    }, []);

    // Funktion um die Farbe des ComputerIcons zu bestimmen
    const getVmStatusColor = (vmData: any) : string => {
        return vmData['state.state'] === '1' ? 'green' : 'grey';
    };

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
                <img
                    src={KvmLogo}
                    alt="Logo"
                    style={{
                        width: open ? '100%' : '50%',
                        maxWidth: open ? '100px' : '32px',
                        minWidth: '32px', // Mindestbreite für das Logo
                        height: 'auto',
                        transition: 'width 0.3s, max-width 0.3s'
                    }}
                />
            </Toolbar>

            <Divider />

            {/* Drawer Close Icon */}
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '8px'
            }}>
                <IconButton onClick={toggleDrawer}>
                    {open ? <ChevronLeftIcon /> : <MenuIcon />}
                </IconButton>
            </div>

            {/* Menubar */}
            <List>

                {/* Home Link */}
                <ListItem key="home" disablePadding>
                    <ListItemButton component={Link} to="/" sx={{ justifyContent: open ? 'initial' : 'center' }}>
                        <ListItemIcon sx={{ minWidth: open ? 48 : 0 }}>
                            <HomeIcon />
                        </ListItemIcon>
                        {open && <ListItemText primary="Home" />}
                    </ListItemButton>
                </ListItem>

                {/* Vm´s Main Link */}
                <ListItem key="vm" disablePadding>
                    <ListItemButton component={Link} to="/vm" onClick={handleVmClick} sx={{ justifyContent: open ? 'initial' : 'center' }}>
                        <ListItemIcon sx={{ minWidth: open ? 48 : 0 }}>
                            <StorageIcon />
                        </ListItemIcon>
                        {open && <ListItemText primary="Virtual Maschines" />}
                        {open ? (openVm ? <ExpandLess /> : <ExpandMore />) : null}
                    </ListItemButton>
                </ListItem>


                {/* Vm´s Link List */}
                {open && (
                    <Collapse in={openVm} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {error && (
                                <ListItem>
                                    <ListItemText
                                        primary="Fehler"
                                        secondary={error}
                                        sx={{ color: 'error.main' }}
                                    />
                                </ListItem>
                            )}
                            {Object.entries(vmList).map(([vmName, vmData]) => (
                                <ListItem key={vmName} disablePadding>
                                    <ListItemButton
                                        component={Link}
                                        to={`/vm/${vmName}`}
                                        sx={{ pl: 4 }}
                                    >
                                        <ListItemIcon>
                                            <ComputerIcon sx={{ color: getVmStatusColor(vmData) }} />
                                        </ListItemIcon>
                                        <ListItemText primary={vmName} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                )}


                {/* Settings Links */}
                <ListItem key="settings" disablePadding>
                    <ListItemButton component={Link} to="/settings" sx={{ justifyContent: open ? 'initial' : 'center' }}>
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
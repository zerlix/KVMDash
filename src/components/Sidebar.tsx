import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { List, Box, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Divider, Toolbar, Collapse } from '@mui/material';
import { logoStyles, drawerControlIcon } from '../Theme';

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
    const getVmStatusColor = (vmData: any): string => {
        return vmData['state.state'] === '1' ? 'green' : 'grey';
    };

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            open={open}
            sx={{
                width: open ? drawerWidth : '64px',
                '& .MuiDrawer-paper': {
                    width: open ? drawerWidth : '64px'
                }
            }}
        >
            {/* Toolbar mit Logo */}
            <Toolbar>
                <img
                    src={KvmLogo}
                    alt="Logo"
                    style={{
                        ...logoStyles.logoTransition.common,
                        ...(open ? logoStyles.logoTransition.open : logoStyles.logoTransition.closed)
                    }}
                />
            </Toolbar>

            <Divider />

            {/* Drawer Close Icon */}
            <Box sx={drawerControlIcon.container}>
                <IconButton onClick={toggleDrawer}>
                    {open ? <ChevronLeftIcon /> : <MenuIcon />}
                </IconButton>
            </Box>

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
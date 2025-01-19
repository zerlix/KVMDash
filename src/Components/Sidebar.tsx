import React from 'react';
import Drawer from '@mui/material/Drawer';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Divider, Toolbar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 240;

interface SidebarProps {
  open: boolean;
  toggleDrawer: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, toggleDrawer }) => {
  return (
    <>
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Divider />
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '8px' }}>
          <IconButton onClick={toggleDrawer} sx={{ position: 'absolute', right: '0px', top: '10px' }}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <List>
          <ListItem key="home" disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <ListItem key="settings" disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      {!open && (
        <IconButton
          onClick={toggleDrawer}
          sx={{ position: 'fixed', top: 72, left: 16, zIndex: 1300 }}
        >
          <MenuIcon />
        </IconButton>
      )}
    </>
  );
};

export default Sidebar;
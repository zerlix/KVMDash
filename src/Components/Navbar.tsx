import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const drawerWidth = 240;

interface TopMenubarProps {
  open: boolean;
}

export default function TopMenubar({ open }: TopMenubarProps) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${open ? drawerWidth : 64}px)`,
        marginLeft: open ? drawerWidth : 64,
        transition: 'width 0.3s, margin-left 0.3s',
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          My Application
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
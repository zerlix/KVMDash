import React from 'react';
import { Typography, Container, Box, Paper } from '@mui/material';

interface DashboardContentProps {
  open: boolean;
}

export default function SettingsContent({ open }: DashboardContentProps) {
  return (
    <Container disableGutters sx={{
      maxWidth: 'none',
      padding: '20px',
      width: '100%',
    }}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Paper sx={{ p: 2 }}>
          Settings
        </Paper>
      </Box>
    </Container>
  );
}
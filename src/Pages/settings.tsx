import { Typography, Container, Box, Paper } from '@mui/material';
import { SpiceViewer } from '../Components/SpiceViewer';
import { useEffect } from 'react';

export default function SettingsContent() {
  // Cleanup bei Unmount
  useEffect(() => {
    return () => {
      // Optional: Globales Cleanup
      const spiceArea = document.getElementById('spice-area');
      const messageDiv = document.getElementById('message-div');
      if (spiceArea) spiceArea.remove();
      if (messageDiv) messageDiv.remove();
    };
  }, []);

  return (
    <Container 
      disableGutters 
      sx={{
        maxWidth: 'none',
        padding: '20px',
        width: '100%',
      }}
    >
      <Typography variant="h5" gutterBottom>
        SPICE Terminal Test
      </Typography>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2,
          backgroundColor: '#f5f5f5' 
        }}
      >
        <SpiceViewer
          host="192.168.0.200"
          port={6080}
          password="optional-password"
        />
      </Paper>
    </Container>
  );
}
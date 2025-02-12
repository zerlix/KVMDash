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
    Todo settings...
    </Container>
  );
}
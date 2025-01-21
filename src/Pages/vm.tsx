import { Typography, Container, Box, Paper } from '@mui/material';

// Settings Page
export default function VmContent() {
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
          Virtual Maschines
        </Paper>
      </Box>
    </Container>
  );
}
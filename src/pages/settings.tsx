import { FC, ReactElement } from 'react';
import { Typography, Container, Box } from '@mui/material';

const SettingsContent: FC = (): ReactElement => {
  return (
    <Container 
      disableGutters 
      sx={{
        maxWidth: 'none',
        padding: '20px',
        width: '100%',
      }}
    >
      <Typography variant="h4" component="h1">
        Einstellungen
      </Typography>
      <Box mt={3}>
        {/* TODO: Einstellungen implementieren */}
      </Box>
    </Container>
  );
};

export default SettingsContent;
import { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Chip,
  IconButton,
  CardActions,
  CardHeader
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { fetchData } from '../services/apiService';
import Grid from '@mui/material/Grid2';

interface VmData {
  [key: string]: {
    'state.state': string;
    'state.reason': string;
    'memory': string;
    'vcpu': string;
  }
}

export default function VmContent() {
  const [vms, setVms] = useState<VmData>({});
  const [error, setError] = useState<string | null>(null);

  const fetchVmList = async () => {
    try {
      const response = await fetchData('qemu/list');
      if (response.status === 'success') {
        setVms(response.data);
      } else {
        setError(response.message || 'Unbekannter Fehler');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchVmList();
    const interval = setInterval(fetchVmList, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (state: string) => {
    return state === '1' ? 'success' : 'error';
  };

  const getStatusText = (state: string) => {
    return state === '1' ? 'Aktiv' : 'Gestoppt';
  };

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={3}>
          {Object.entries(vms).map(([vmName, vmData]) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={vmName}>
              <Card elevation={3}>
                <CardHeader 
                  title={vmName}
                  action={
                    <Chip 
                      label={getStatusText(vmData['state.state'])} 
                      color={getStatusColor(vmData['state.state'])}
                      size="small"
                    />
                  }
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Speicher: {vmData.memory}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    vCPUs: {vmData.vcpu}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {vmData['state.reason']}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton 
                    size="small" 
                    color="primary"
                    disabled={vmData['state.state'] === '1'}
                  >
                    <PlayArrowIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error"
                    disabled={vmData['state.state'] === '0'}
                  >
                    <StopIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="primary"
                    disabled={vmData['state.state'] === '0'}
                  >
                    <RestartAltIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
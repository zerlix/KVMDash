import { useState, useEffect } from 'react';
import { Box, Card, CardContent, CardHeader, Typography, Chip, IconButton, CardActions, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { fetchVmList } from '../services/vmService';
import { fetchData } from '../services/apiService';

interface VmData {
    [key: string]: {
        'state.state': string;
        'state.reason': string;
        'balloon.current': string;
        'vcpu.current': string;
    }
}

export default function VmContent() {

    const [vms, setVms] = useState<VmData>({});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<string>('');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchVmList();
                setVms(data);
            } catch (err: any) {
                setError(err.message);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);


    // Timeout für VM-Aktionen
    const VM_ACTION_TIMEOUT = 30000; // 30 Sekunden

    const handleVmAction = async (action: string, vmName: string) => {
        setLoading(vmName);
        setError(null);

        // Promise mit Timeout
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Aktion hat zu lange gedauert')), VM_ACTION_TIMEOUT);
        });

        try {
            // Race zwischen API-Call und Timeout
            await Promise.race([
                fetchData(`qemu/${action}/${vmName}`, { method: 'POST' }),
                timeoutPromise
            ]);

        } catch (err: any) {
            console.error(`VM ${action} Fehler:`, err);
            setError(`VM Aktion fehlgeschlagen: ${err.message}`);
            
            // Force-Refresh der VM-Liste bei Timeout
            const data = await fetchVmList();
            setVms(data);
        } finally {
            setLoading('');
        }
    };

    // Status Funktionen
    const getStatusColor = (state: string) => {
        return state === '1' ? 'success' : 'error';
    };

    const getStatusText = (state: string) => {
        return state === '1' ? 'Aktiv' : 'Gestoppt';
    };

    const formatMemory = (memoryKB: string) => {
        return (parseInt(memoryKB) / 1024 / 1024).toFixed(1) + ' GB';
    };


    return (
        <Box sx={{ flexGrow: 1, p: 4 }}>
            {error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <Grid container spacing={2}>
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
                                        RAM: {formatMemory(vmData['balloon.current'])}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        vCPUs: {vmData['vcpu.current']}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        disabled={vmData['state.state'] === '1' || loading === vmName}
                                        onClick={() => handleVmAction('start', vmName)}
                                    >
                                        <PlayArrowIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        disabled={vmData['state.state'] === '5' || loading === vmName}
                                        onClick={() => handleVmAction('stop', vmName)}
                                    >
                                        <StopIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        disabled={vmData['state.state'] === '5' || loading === vmName}
                                        onClick={() => handleVmAction('reboot', vmName)}
                                    >
                                        <RestartAltIcon />
                                    </IconButton>
                                    {loading === vmName && <CircularProgress size={20} />}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
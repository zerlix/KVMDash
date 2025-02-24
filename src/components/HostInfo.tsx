import { Box, Card, CardHeader, Typography, CardContent, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState, JSX } from 'react';
import { api } from '../services/apiService';
import { SystemInfo } from '../types/system.types';

export default function HostInfo(): JSX.Element {
    // State Management
    const [systemInfo, setHostInfo] = useState<SystemInfo | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Nur ein useEffect für das Polling
    useEffect(() => {
        const fetchHostInfo = async () => {
            try {
                const info = await api.get<SystemInfo>('host/info');
                setHostInfo(info);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
                setError(message);
                console.error('Fehler beim Laden der Host-Informationen:', message);
            }
        };
    
        fetchHostInfo();
        const interval = setInterval(fetchHostInfo, 5000);
        return () => clearInterval(interval);
    }, []);

    // Render
    return (
        <Box sx={{ flexGrow: 1, p: 4 }}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardHeader 
                    title="Systeminformationen"
                />
                <CardContent>
                    {error ? (
                        <Typography color="error">{error}</Typography>
                    ) : !systemInfo ? (
                        <Box display="flex" justifyContent="center" p={2}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Grid container spacing={2} alignItems="center">
                            {[
                                { label: "Hostname", value: systemInfo.Hostname },
                                { label: "Betriebssystem", value: systemInfo.OperatingSystemPrettyName },
                                { label: "Kernel", value: `${systemInfo.KernelName} ${systemInfo.KernelRelease}` },
                                { label: "Hardware", value: `${systemInfo.HardwareVendor} ${systemInfo.HardwareModel}` }
                            ].map(({ label, value }, index) => (
                                <Grid size={{xs: 12, md: 6}} key={index}>
                                    <Typography variant="subtitle2" color="textSecondary">{label}</Typography>
                                    <Typography variant="body1">{value}</Typography>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
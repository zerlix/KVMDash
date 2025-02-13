import { Box, Card, CardHeader, Typography, CardContent, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState, JSX } from 'react';
import { fetchData } from '../services/apiService';

// Definiere API Datenstruktur
interface SystemInfo {
    Hostname: string;
    KernelName: string;
    KernelRelease: string;
    OperatingSystemPrettyName: string;
    HardwareVendor: string;
    HardwareModel: string;
}

export default function HostInfo(): JSX.Element {
    // State Management
    const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
    const [error, setError] = useState<string | null>(null);

    // API Abruf
    const fetchSystemInfo = async (): Promise<void> => {
        try {
            // Hier erwarten wir direkt SystemInfo als data Typ
            const response = await fetchData<SystemInfo>('host/info');
            if (response.status === 'success') {
                setSystemInfo(response.data);
                setError(null);
            } else {
                setError(response.message || 'Unbekannter Fehler');
            }
        } catch (err: any) {
            setError(err.message);
        }
    }

    // Automatische Aktualisierung
    useEffect((): (() => void) => {
        fetchSystemInfo();
        const interval = setInterval(fetchSystemInfo, 5000);
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
                        // errormessage
                        <Typography color="error">{error}</Typography>
                    ) : !systemInfo ? (
                        // progress (loading)
                        <Box display="flex" justifyContent="center" p={2}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        // output
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
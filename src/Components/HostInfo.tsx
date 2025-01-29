import { Box, Card, Typography, Paper, CardContent, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Grid2 from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { red } from '@mui/material/colors';
import { fetchData } from '../services/apiService';

const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2)
}));

// Definiere Datenstruktur
interface SystemInfo {
    Hostname: string;
    KernelName: string;
    KernelRelease: string;
    OperatingSystemPrettyName: string;
    HardwareVendor: string;
    HardwareModel: string;
}

export default function HostInfo() {
    // State Management
    const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
    const [error, setError] = useState<string | null>(null);

    // API Abruf
    const fetchSystemInfo = async () => {
        try {
            const response = await fetchData('host/info');
            // Parse JSON string aus data
            const data = JSON.parse(response);
            setSystemInfo(data);
            setError(null);
        } catch (err: any) {
            console.error('Fetch Error:', err);
            setError(err.message);
        }
    }

    // Automatische Aktualisierung
    useEffect(() => {
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
                        <Typography color="error">{error}</Typography>
                    ) : !systemInfo ? (
                        <Box display="flex" justifyContent="center" p={2}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Grid2 container spacing={2} alignItems="center">
                            {[
                                { label: "Hostname", value: systemInfo.Hostname },
                                { label: "Betriebssystem", value: systemInfo.OperatingSystemPrettyName },
                                { label: "Kernel", value: `${systemInfo.KernelName} ${systemInfo.KernelRelease}` },
                                { label: "Hardware", value: `${systemInfo.HardwareVendor} ${systemInfo.HardwareModel}` }
                            ].map(({ label, value }, index) => (
                                <Grid2 item xs={12} md={6} key={index}>
                                    <Typography variant="subtitle2" color="textSecondary">{label}</Typography>
                                    <Typography variant="body1">{value}</Typography>
                                </Grid2>
                            ))}
                        </Grid2>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
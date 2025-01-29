import { Box, Card, Typography, Paper, CardContent, CircularProgress  } from '@mui/material';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { red } from '@mui/material/colors';

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
            const token = localStorage.getItem('token');
            console.log('Token beim Fetch:', token); // Debug Token
    
            if (!token) {
                setError('Nicht authentifiziert');
                return;
            }
    
            // Teste API mit minimalem Request
            const response = await fetch('http://kvmdash.back/api/host/info', {
                headers: {
                    'Authorization': token // Token senden
                }
            });
    
            console.log('API Response Status:', response.status); // Debug Response
    
            if (!response.ok) {
                throw new Error(`Status: ${response.status}`);
            }
    
            const result = await response.json();
            if (result.status === 'success') {
                setSystemInfo(JSON.parse(result.data));
            }
        } catch (err) {
            console.error('Fetch Error:', err);
            setError('Fehler beim Laden');
        }
    };

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
                    <Grid container spacing={2} alignItems="center">
                        {[
                            { label: "Hostname", value: systemInfo.Hostname },
                            { label: "Betriebssystem", value: systemInfo.OperatingSystemPrettyName },
                            { label: "Kernel", value: `${systemInfo.KernelName} ${systemInfo.KernelRelease}` },
                            { label: "Hardware", value: `${systemInfo.HardwareVendor} ${systemInfo.HardwareModel}` }
                        ].map(({ label, value }, index) => (
                            <Grid item xs={12} md={6} key={index}>
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
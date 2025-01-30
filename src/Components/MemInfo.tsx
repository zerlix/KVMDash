import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, Box, Typography, LinearProgress } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { fetchData } from '../services/apiService';

interface MemData {
    total: string;
    used: string;
    available: string;
}

const convertToGB = (value: string): number => {
    const unit = value.slice(-2);
    const num = parseFloat(value.slice(0, -2));
    switch (unit) {
        case 'Ti':
            return num * 1024;
        case 'Gi':
            return num;
        case 'Mi':
            return num / 1024;
        case 'Ki':
            return num / (1024 * 1024);
        default:
            return num;
    }
};

const MemInfoCard = () => {
    const [memData, setMemData] = useState<MemData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMemInfo = async () => {
        try {
            const response = await fetchData('host/mem');
            if (response.status === 'success') {
                console.log('API Response:', response.data); // Debugging-Log
                setMemData(response.data);
            } else {
                setError(response.message || 'Unbekannter Fehler');
            }
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMemInfo();
        const interval = setInterval(fetchMemInfo, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    if (!memData) {
        return null;
    }

    const totalGB = convertToGB(memData.total);
    const usedGB = convertToGB(memData.used);
    const availableGB = convertToGB(memData.available);
    const usedPercentage = (usedGB / totalGB) * 100;

    console.log('Total GB:', totalGB); // Debugging-Log
    console.log('Used GB:', usedGB); // Debugging-Log
    console.log('Available GB:', availableGB); // Debugging-Log

    return (
        <Box sx={{ flexGrow: 1, p: 4 }}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardHeader title="Speicherinformationen" />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    Gesamtspeicher: {memData.total}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <Box sx={{ width: '100%', mr: 1, position: 'relative' }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={100}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                backgroundColor: 'transparent',
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: '#00c853' // Grün für den gesamten Speicherplatz
                                                }
                                            }}
                                        />
                                        <LinearProgress
                                            variant="determinate"
                                            value={usedPercentage}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                backgroundColor: 'transparent',
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: '#ff4444' // Rot für den belegten Speicherplatz
                                                },
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%'
                                            }}
                                        />
                                    </Box>
                                    <Typography variant="body2" sx={{ minWidth: 45 }}>
                                        {memData.used}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Verfügbar: {memData.available} (Gesamt: {memData.total}, Belegt: {memData.used})
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default MemInfoCard;
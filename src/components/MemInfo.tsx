import { useState, useEffect, JSX } from "react";
import { Card, CardContent, CardHeader, Box, Typography, LinearProgress } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { fetchData } from '../services/apiService';
import { MemData } from '../types/mem.types';


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

const MemInfoCard = (): JSX.Element => {
    const [memData, setMemData] = useState<MemData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMemInfo = async (): Promise<void> => {
        try {
            const response = await fetchData<MemData>('host/mem');
            if (response.status === 'success') {
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

    useEffect((): (() => void) => {
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
        return <></>;
    }

    const totalGB = convertToGB(memData.total);
    const usedGB = convertToGB(memData.used);
    const availableGB = convertToGB(memData.available);
    const usedPercentage = (usedGB / totalGB) * 100;

    return (
        <Box sx={{ flexGrow: 1, p: 4 }}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardHeader title="Speicherinformationen" />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid  size={{xs:12}}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Gesamtspeicher: {memData.total}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 2 }}>
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
                            <Typography variant="body2">
                                Verfügbar: {availableGB} GiB (Gesamt: {totalGB} GiB, Belegt: {usedGB} GiB)
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default MemInfoCard;
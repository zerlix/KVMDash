import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, Box, Typography, LinearProgress } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { fetchData } from '../services/apiService';

interface DiskData {
    Filesystem: string;
    Size: string;
    Used: string;
    Avail: string;
    Use: string;
    Mounted: string;
}

const convertToGB = (value: string): number => {
    const unit = value.slice(-1);
    const num = parseFloat(value.slice(0, -1));
    switch (unit) {
        case 'T':
            return num * 1024;
        case 'G':
            return num;
        case 'M':
            return num / 1024;
        case 'K':
            return num / (1024 * 1024);
        default:
            return num;
    }
};

const DiskInfoCard = () => {
    const [diskData, setDiskData] = useState<DiskData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDiskInfo = async () => {
        try {
            const response = await fetchData('host/disk');
            if (response.status === 'success') {
                setDiskData(response.data);
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
        fetchDiskInfo();
    }, []);

    return (
        <Box sx={{ flexGrow: 1, p: 4 }}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardHeader title="Festplatteninformationen" />
                <CardContent>
                    {loading ? (
                        <Typography>Loading...</Typography>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {diskData.map((disk, index) => {
                                const totalGB = convertToGB(disk.Size);
                                const usedGB = convertToGB(disk.Used);
                                const usedPercentage = (usedGB / totalGB) * 100;
                                return (
                                    <Grid size={{ xs: 12, md: 6 }} key={index}>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                {disk.Mounted} 
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
                                                    {disk.Use}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                Verfügbar: {disk.Avail} ({disk.Size} total, {disk.Used} used)
                                            </Typography>
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default DiskInfoCard;
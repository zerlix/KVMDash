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

const getUsageColor = (usage: number) => {
    if (usage > 80) return '#ff4444';     // Rot bei hoher Last
    if (usage > 10) return '#ffaa00';     // Orange bei mittlerer Last
    return '#00c853';                     // Grün bei niedriger Last
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
                            {diskData.map((disk, index) => (
                                <Grid size={{ xs: 12, md: 6 }} key={index}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            {disk.Mounted} 
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={parseFloat(disk.Use)}
                                                sx={{
                                                    width: '100%',
                                                    height: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: 'surface.main',
                                                    '& .MuiLinearProgress-bar': {
                                                        backgroundColor: getUsageColor(parseFloat(disk.Use))
                                                    }
                                                }}
                                            />
                                            <Typography variant="body2" sx={{ ml: 2, minWidth: 45 }}>
                                                {disk.Use}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            Verfügbar: {disk.Avail} ({disk.Size} total, {disk.Used} used)
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default DiskInfoCard;
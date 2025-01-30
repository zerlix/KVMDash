import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, Box, Typography, LinearProgress } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { fetchData } from '../services/apiService';

interface CpuData {
    cpu: string;
    total: number;
    idle: number;
    used: number;
    usage: number;
}

const getUsageColor = (usage: number) => {
    if (usage > 80) return '#ff4444';     // Rot bei hoher Last
    if (usage > 60) return '#ffaa00';     // Orange bei mittlerer Last
    return '#00c853';                     // Grün bei niedriger Last
};

const CpuInfoCard = () => {
    const [cpuData, setCpuData] = useState<CpuData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCpuInfo = async () => {
        try {
            const response = await fetchData('host/cpu');
            console.log('API Response:', response); // Debugging-Log
            if (response.status === 'success') {
                const filteredData = response.data.filter((cpu: CpuData) => cpu.cpu !== 'cpu');
                console.log('Filtered Data:', filteredData); // Debugging-Log
                setCpuData(filteredData);
            } else {
                setError(response.message || 'Unbekannter Fehler');
            }
            setLoading(false);
        } catch (err: any) {
            setError(`Error: ${err.message}`);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCpuInfo();
        const interval = setInterval(fetchCpuInfo, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        console.log('CPU Data:', cpuData); // Debugging-Log
    }, [cpuData]);

    return (
        <Box sx={{ flexGrow: 1, p: 4 }}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardHeader title="CPU Auslastung" />
                <CardContent>
                    {loading ? (
                        <Typography>Loading...</Typography>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <Grid container spacing={1}>
                            {cpuData.map((cpu) => (
                                <Grid size={{xs: 12, md: 6}} key={cpu.cpu}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="body2" sx={{ minWidth: 60 }}>
                                            Core {cpu.cpu.replace('cpu', '')}
                                        </Typography>
                                        <Box sx={{ width: '100%', mr: 1 }}>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={cpu.usage} 
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: 'surface.main',
                                                    '& .MuiLinearProgress-bar': {
                                                        backgroundColor: getUsageColor(cpu.usage)
                                                    }
                                                }}
                                            />
                                        </Box>
                                        <Typography variant="body2" sx={{ minWidth: 45 }}>
                                            {cpu.usage.toFixed(1)}%
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

export default CpuInfoCard;
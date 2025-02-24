import { useState, useEffect, JSX } from "react";
import { Card, CardContent, CardHeader, Box, Typography, LinearProgress } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { api } from '../services/apiService';
import { CpuData } from '../types/cpu.types';

const getUsageColor = (usage: number): string => {
    if (usage > 80) return '#ff4444';     // Rot bei hoher Last
    if (usage > 60) return '#ffaa00';     // Orange bei mittlerer Last
    return '#00c853';                     // Grün bei niedriger Last
};

const CpuInfoCard = (): JSX.Element => {
    const [cpuData, setCpuData] = useState<CpuData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCpuInfo = async (): Promise<void> => {
        try {
            const data = await api.get<CpuData[]>('host/cpu');
            // Keine response.status Prüfung mehr nötig, da der api Service das handhabt
            const filteredData = data.filter(cpu => cpu.cpu !== 'cpu');
            setCpuData(filteredData);
            setLoading(false);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
            setError(`Error: ${message}`);
            setLoading(false);
        }
    };
    useEffect((): (() => void) => {
        fetchCpuInfo();
        const interval = setInterval(fetchCpuInfo, 5000);
        return () => clearInterval(interval);
    }, []);


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
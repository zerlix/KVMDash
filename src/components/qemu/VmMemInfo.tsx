import { JSX } from 'react';
import { Card, CardContent, CardHeader, Typography, Box, LinearProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import MemoryIcon from '@mui/icons-material/Memory';
import { VmDetails } from '../../types/vm.types';

interface VmMemInfoProps {
    vmDetails: VmDetails;
}

export function VmMemInfo({ vmDetails }: VmMemInfoProps): JSX.Element {
    
    // Alle Werte sind in KiB, Umrechnung in GiB
    const totalMem = parseInt(vmDetails.memory);
    const availableMem = vmDetails.stats.memory.available;
    const usedMem = vmDetails.stats.memory.current - vmDetails.stats.memory.unused;
    
    // Berechnung in GiB (1 GiB = 1024 MiB = 1048576 KiB)
    const totalGB = totalMem / 1048576;
    const availableGB = availableMem / 1048576;
    const usedGB = usedMem / 1048576;
    
    // Prozentuale Auslastung
    const usedPercentage = (usedMem / totalMem) * 100;

    return (
        <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardHeader
                title="Arbeitsspeicher"
                avatar={<MemoryIcon color="primary" />}
            />
            <CardContent>
                <Grid container spacing={2}>
                    <Grid size={{xs:12}}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Gesamtspeicher: {totalGB.toFixed(1)} GiB
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
                                            backgroundColor: '#00c853'
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
                                            backgroundColor: '#ff4444'
                                        },
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%'
                                    }}
                                />
                            </Box>
                        </Box>
                        <Typography variant="body2">
                            Verfügbar: {availableGB.toFixed(1)} GiB (Belegt: {usedGB.toFixed(1)} GiB)
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

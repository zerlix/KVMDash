import { useState, useEffect, JSX, useMemo } from 'react';  
import { useParams } from 'react-router-dom';
import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import { api } from '../services/apiService';
import { SpiceViewer } from '../components/SpiceViewer';
import { VmGuestInfo } from '../components/qemu/VmGuestInfo';
import { VmMemInfo } from '../components/qemu/VmMemInfo';
import { VmCpuInfo } from '../components/qemu/VmCpuInfo';
import { VmDiskInfo } from '../components/qemu/VmDiskInfo';

import { VmDetails } from '../types/vm.types';


export default function VmDetailsPage(): JSX.Element {
    const { vmName } = useParams<{ vmName: string }>();
    const [vmDetails, setVmDetails] = useState<VmDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVmDetails = async (): Promise<void> => {
        try {
            const details = await api.get<VmDetails>(`qemu/listdetails/${vmName}`);
            setVmDetails(details);
            setError(null);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    // SPICE Viewer Komponente memoisieren
    const spiceViewer = useMemo(() => {
        if (!vmDetails?.spice.port) return null;

        return (
            <SpiceViewer
                host="192.168.0.200"
                port={parseInt(vmDetails.spice.port) + 1000}
            />
        );
    }, [vmDetails?.spice.port]);

    useEffect(() => {
        // Initial-Aufruf
        fetchVmDetails();

        // Interval für Updates alle 5 Sekunden
        const interval = setInterval(() => {
            fetchVmDetails();
        }, 5000);

        // Cleanup-Funktion
        return () => clearInterval(interval);
    }, [vmName]);

    if (loading) return <Typography>Lade VM Details...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!vmDetails) return <Typography>Keine Details verfügbar</Typography>;

    return (
        <Box sx={{ flexGrow: 1, p: 4 }}>
            <Grid container spacing={2}>
                {/* VM Gast Informationen */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <VmGuestInfo vmDetails={vmDetails} />
                </Grid>
    
                {/* VM Memory Informationen */}
                <Grid size={{ xs: 12, md: 6 }}>
                    {/*<VmMemInfo vmDetails={vmDetails} /> */}
                </Grid>
    
                {/* VM CPU Informationen */}
                <Grid size={{ xs: 12, md: 6 }}>
                    {/*<VmCpuInfo vmDetails={vmDetails} /> */}
                </Grid>
    
                {/* VM Disk Informationen */}
                <Grid size={{ xs: 12, md: 6 }}>
                    {/*<VmDiskInfo vmDetails={vmDetails} /> */}
                </Grid>
    
                {/* SPICE Remote Konsole */}
                <Grid size={{ xs: 12 }}>
                    <Card elevation={3} sx={{ borderRadius: 3 }}>
                        <CardHeader
                            title={<Typography variant="h6">SPICE Remote Konsole</Typography>}
                            avatar={<DisplaySettingsIcon color="primary" />}
                        />
                        <CardContent>
                            {spiceViewer || (
                                <Typography variant="body2" color="text.secondary">
                                    Keine SPICE Verbindung verfügbar
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
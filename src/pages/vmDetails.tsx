import { useState, useEffect, JSX } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import { fetchData } from '../services/apiService';
import { SpiceViewer } from '../components/SpiceViewer';

interface VmDetails {
    name: string;
    spice: {
        port: string;
        type: string;
        listen: string;
    };
}

export default function VmDetailsPage(): JSX.Element {
    const { vmName } = useParams<{ vmName: string }>();
    const [vmDetails, setVmDetails] = useState<VmDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVmDetails = async (): Promise<void> => {
            try {
                const data = await fetchData<VmDetails>(`qemu/listdetails/${vmName}`);
                if (data.status === 'success') {
                    setVmDetails(data.data);
                } else {
                    throw new Error(data.message || 'Fehler beim Laden der VM Details');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
            } finally {
                setLoading(false);
            }
        };

        fetchVmDetails();
    }, [vmName]);

    if (loading) return <Typography>Lade VM Details...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!vmDetails) return <Typography>Keine Details verfügbar</Typography>;

    return (
        <Box sx={{ flexGrow: 1, p: 4 }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Card elevation={3}>
                        <CardHeader
                            title={<Typography variant="h6">SPICE Remote Konsole</Typography>}
                            avatar={<DisplaySettingsIcon color="primary" />}
                        />
                        <CardContent>
                            {vmDetails.spice.port ? (
                                <SpiceViewer
                                    host="192.168.0.200"
                                    port={parseInt(vmDetails.spice.port) + 1000}
                                />
                            ) : (
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
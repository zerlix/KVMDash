import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, CardContent, CardHeader, Typography, List, ListItem, ListItemText, Chip } from '@mui/material';
import Grid from '@mui/material/Grid2';
import MemoryIcon from '@mui/icons-material/Memory';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import { fetchData } from '../services/apiService';
import { SpiceViewer } from '../Components/SpiceViewer';



interface VmDetails {
    name: string;
    memory: string;
    vcpu: string;
    os: {
        type: string;
        arch: string;
    };
    spice: {
        port: string;
        type: string;
        listen: string;
    };
    network: Array<{
        name: string;
        hardware_address: string;
        ip_addresses: Array<{
            type: string;
            address: string;
        }>;
    }>;
}

export default function VmDetailsPage() {
    const { vmName } = useParams<{ vmName: string }>();
    const [vmDetails, setVmDetails] = useState<VmDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVmDetails = async () => {
            try {
                const data = await fetchData(`qemu/listdetails/${vmName}`);
                if (data.status === 'success') {
                    setVmDetails(data.data);
                } else {
                    throw new Error(data.message || 'Fehler beim Laden der VM Details');
                }
            } catch (err) {
                console.error('VM Details Fehler:', err);
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
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card elevation={3}>
                        <CardHeader
                            title="System"
                            avatar={<MemoryIcon color="primary" />}
                            titleTypographyProps={{ variant: 'h6' }}
                        />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                Architektur: {vmDetails.os.arch} ({vmDetails.os.type})
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                RAM: {(parseInt(vmDetails.memory) / 1024 / 1024).toFixed(1)} GB
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                vCPUs: {vmDetails.vcpu}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card elevation={3}>
                        <CardHeader
                            title="Netzwerk"
                            avatar={<NetworkCheckIcon color="primary" />}
                            titleTypographyProps={{ variant: 'h6' }}
                        />
                        <CardContent>
                            {vmDetails.network.map((net, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {net.name} - MAC: {net.hardware_address}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                        {net.ip_addresses.map((ip, ipIndex) => (
                                            <Chip
                                                key={ipIndex}
                                                label={`${ip.type}: ${ip.address}`}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card elevation={3}>
                        <CardHeader
                            title="SPICE Verbindung"
                            avatar={<DisplaySettingsIcon color="primary" />}
                            titleTypographyProps={{ variant: 'h6' }}
                        />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                Port: {vmDetails.spice.port}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Listen Address: {vmDetails.spice.listen}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Card elevation={3}>
                    <CardHeader
                        title="SPICE Remote Konsole"
                        avatar={<DisplaySettingsIcon color="primary" />}
                        titleTypographyProps={{ variant: 'h6' }}
                    />
                    <CardContent>
                        {vmDetails.spice.port ? (
                            <SpiceViewer
                                host="192.168.0.200"
                                port={parseInt(vmDetails.spice.port) + 1000}
                            // Optional: Wenn Sie ein Passwort haben
                            // password="your-password"
                            />
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                Keine SPICE Verbindung verfügbar
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>
        </Box>
    );
}
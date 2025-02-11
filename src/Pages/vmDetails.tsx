import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '@mui/material';
import { Container, Typography, Chip, List, ListItem, ListItemText, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ComputerIcon from '@mui/icons-material/Computer';
import MemoryIcon from '@mui/icons-material/Memory';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import { fetchData } from '../services/apiService';

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

const VmDetailsPage: React.FC = () => {
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
            <Grid container spacing={3}>
                {/* System Info Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card elevation={3}>
                        <CardHeader
                            title="System"
                            avatar={<MemoryIcon color="primary" />}
                            titleTypographyProps={{ variant: 'h6' }}
                        />
                        <CardContent>
                            <List>
                                <ListItem>
                                    <ListItemText 
                                        primary="Architektur"
                                        secondary={`${vmDetails.os.arch} (${vmDetails.os.type})`}
                                        primaryTypographyProps={{ fontWeight: 'medium' }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="RAM"
                                        secondary={`${parseInt(vmDetails.memory) / 1024 / 1024} GB`}
                                        primaryTypographyProps={{ fontWeight: 'medium' }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="vCPUs"
                                        secondary={vmDetails.vcpu}
                                        primaryTypographyProps={{ fontWeight: 'medium' }}
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Network Info Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card elevation={3}>
                        <CardHeader
                            title="Netzwerk"
                            avatar={<NetworkCheckIcon color="primary" />}
                            titleTypographyProps={{ variant: 'h6' }}
                        />
                        <CardContent>
                            {vmDetails.network.map((net, index) => (
                                <Box key={index} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
                                        {net.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        MAC: {net.hardware_address}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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

                {/* SPICE Info Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card elevation={3}>
                        <CardHeader
                            title="SPICE Verbindung"
                            avatar={<DisplaySettingsIcon color="primary" />}
                            titleTypographyProps={{ variant: 'h6' }}
                        />
                        <CardContent>
                            <List>
                                <ListItem>
                                    <ListItemText 
                                        primary="Port"
                                        secondary={vmDetails.spice.port}
                                        primaryTypographyProps={{ fontWeight: 'medium' }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="Listen Address"
                                        secondary={vmDetails.spice.listen}
                                        primaryTypographyProps={{ fontWeight: 'medium' }}
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default VmDetailsPage;
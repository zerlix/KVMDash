import { JSX } from 'react';
import { Card, CardContent, CardHeader, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid2'; // Änderung hier
import PersonIcon from '@mui/icons-material/Person';
import { VmDetails } from '../../types/vm.types';

interface VmGuestInfoProps {
    vmDetails: VmDetails;
}

export function VmGuestInfo({ vmDetails }: VmGuestInfoProps): JSX.Element {
    const guestInfo = [
        { label: "Name", value: vmDetails.name },
        { label: "vCPUs", value: vmDetails.vcpu },
        { label: "Arbeitsspeicher", value: `${parseInt(vmDetails.memory) / 1024} GB` },
        ...(vmDetails.network.length > 0 ? vmDetails.network.flatMap(iface => 
            iface.ip_addresses
                .filter(ip => ip.type === 'ipv4')
                .map(ip => ({
                    label: `IP (${iface.name})`,
                    value: ip.address
                }))
        ) : [])
    ];

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardHeader 
                    title="Gast Informationen"
                    avatar={<PersonIcon color="primary" />}
                />
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        {guestInfo.map(({ label, value }, index) => (
                            <Grid size={{xs: 12, md: 6}} key={index}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    {label}
                                </Typography>
                                <Typography variant="body1">
                                    {value}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    TextField,
    Button,
    MenuItem,
    Box
} from '@mui/material';
import ComputerIcon from '@mui/icons-material/Computer';
import Grid from '@mui/material/Grid2';

interface CreateVmFormProps {
    onSubmit: (data: VmFormData) => void;
}

export interface VmFormData {
    name: string;
    memory: number;
    vcpus: number;
    disk_size: number;
    iso_image: string;
    network_bridge: string;
    os_variant: string;
}

const initialFormData: VmFormData = {
    name: '',
    memory: 2048,
    vcpus: 2,
    disk_size: 20,
    iso_image: '/mnt/raid/CDImages/debian-12.9.0-amd64-netinst.iso',
    network_bridge: 'br0',
    os_variant: 'linux2022'
};

export const CreateVmForm: React.FC<CreateVmFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<VmFormData>(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);  // Debug-Ausgabe
        onSubmit(formData);
    };

    return (
        <Card elevation={3}>
            <CardHeader
                title="Neue VM erstellen"
                avatar={<ComputerIcon color="primary" />}
                titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="VM Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="RAM (MB)"
                                name="memory"
                                type="number"
                                value={formData.memory}
                                onChange={handleChange}
                                required
                                inputProps={{ min: 512, step: 512 }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="CPUs"
                                name="vcpus"
                                type="number"
                                value={formData.vcpus}
                                onChange={handleChange}
                                required
                                inputProps={{ min: 1, max: 16 }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Festplattengröße (GB)"
                                name="disk_size"
                                type="number"
                                value={formData.disk_size}
                                onChange={handleChange}
                                required
                                inputProps={{ min: 5 }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Network Bridge"
                                name="network_bridge"
                                value={formData.network_bridge}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12}}>
                            <TextField
                                fullWidth
                                label="ISO Image"
                                name="iso_image"
                                value={formData.iso_image}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12}}>
                            <TextField
                                fullWidth
                                select
                                label="Betriebssystem"
                                name="os_variant"
                                value={formData.os_variant}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="linux2022">Linux 2022</MenuItem>
                                <MenuItem value="debian12">Debian 12</MenuItem>
                                <MenuItem value="ubuntu22.04">Ubuntu 22.04</MenuItem>
                                <MenuItem value="win11">Windows 11</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12}}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                VM erstellen
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CreateVmForm;
import React, { useState, useEffect } from 'react';
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
import { fetchData } from '../services/apiService';


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
    iso_image: '',
    network_bridge: 'br0',
    os_variant: 'linux2022'
};

interface IsoFile {
    name: string;
    path: string;
}

export const CreateVmForm: React.FC<CreateVmFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<VmFormData>(initialFormData);
    const [isoFiles, setIsoFiles] = useState<IsoFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [networkType, setNetworkType] = useState('bridge');

    const handleNetworkTypeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const type = e.target.value;
        setNetworkType(type);
        setFormData(prev => ({
            ...prev,
            network_bridge: type === 'nat' ? 'default' : 'br0'
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        onSubmit(formData);
    };


    useEffect(() => {
        const loadIsoFiles = async () => {
            try {
                const response = await fetchData<IsoFile[]>('iso/list');
                if (response.status === 'success') {
                    setIsoFiles(response.data);
                    // Optional: Setze erste ISO als Standard
                    if (response.data.length > 0) {
                        setFormData(prev => ({
                            ...prev,
                            iso_image: response.data[0].path
                        }));
                    }
                }
            } catch (error) {
                console.error('Fehler beim Laden der ISO-Dateien:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadIsoFiles();
    }, []);


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
                                select
                                label="Netzwerk Typ"
                                value={networkType}
                                onChange={handleNetworkTypeChange}
                                required
                            >
                                <MenuItem value="bridge">Bridge (br0)</MenuItem>
                                <MenuItem value="nat">NAT</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                select
                                label="ISO Image"
                                name="iso_image"
                                value={formData.iso_image}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <MenuItem disabled>Lade ISO-Dateien...</MenuItem>
                                ) : (
                                    isoFiles.map((iso) => (
                                        <MenuItem key={iso.path} value={iso.path}>
                                            {iso.name}
                                        </MenuItem>
                                    ))
                                )}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
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
                        <Grid size={{ xs: 12 }}>
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
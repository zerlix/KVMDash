import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    TextField,
    Button,
    MenuItem,
    Box,
    Autocomplete
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
    network_bridge: '', // Änderung hier: leerer String als Initialwert
    os_variant: 'linux2022'
};

interface IsoFile {
    name: string;
    path: string;
}

interface NetworkOption {
    name: string;
    type: 'bridge' | 'nat';
    value: string;
    active?: boolean;
}

export const CreateVmForm: React.FC<CreateVmFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<VmFormData>(initialFormData);
    const [isoFiles, setIsoFiles] = useState<IsoFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [networkOptions, setNetworkOptions] = useState<NetworkOption[]>([]);
    const [osVariants, setOsVariants] = useState<string[]>([]);

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

        const loadNetworkOptions = async () => {
            try {
                const response = await fetchData<NetworkOption[]>('qemu/network/list');
                if (response.status === 'success') {
                    console.log('Received network options:', response.data); // Debug logging
                    const activeNetworks = response.data.filter(opt => 
                        opt.type === 'bridge' || (opt.type === 'nat' && opt.active)
                    );
                    setNetworkOptions(activeNetworks);
                    
                    // Setze ersten verfügbaren Wert als Standard
                    if (activeNetworks.length > 0) {
                        console.log('Setting default network:', activeNetworks[0].value); // Debug logging
                        setFormData(prev => ({
                            ...prev,
                            network_bridge: activeNetworks[0].value
                        }));
                    }
                }
            } catch (error) {
                console.error('Fehler beim Laden der Netzwerkoptionen:', error);
            }
        };

        const loadOsVariants = async () => {
            try {
                const response = await fetchData<string[]>('qemu/osinfo/list');
                if (response.status === 'success') {
                    setOsVariants(response.data);
                }
            } catch (error) {
                console.error('Fehler beim Laden der OS-Varianten:', error);
            }
        };

        loadIsoFiles();
        loadNetworkOptions();
        loadOsVariants();
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
                                label="Netzwerk"
                                name="network_bridge"
                                value={formData.network_bridge}
                                onChange={handleChange}
                                required
                            >
                                {networkOptions.length === 0 ? (
                                    <MenuItem disabled>Keine Netzwerke verfügbar</MenuItem>
                                ) : (
                                    networkOptions.map((option) => (
                                        <MenuItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.name}
                                        </MenuItem>
                                    ))
                                )}
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
                            <Autocomplete
                                fullWidth
                                options={osVariants}
                                value={formData.os_variant}
                                onChange={(event, newValue) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        os_variant: newValue || 'linux2022'
                                    }));
                                }}
                                renderInput={(params) => (
                                    <TextField 
                                        {...params} 
                                        label="Betriebssystem"
                                        required
                                    />
                                )}
                            />
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
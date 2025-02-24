import { useState, useEffect, JSX } from 'react';
import {
    Box, Card, CardContent, CardHeader, Typography,
    Chip, IconButton, CardActions, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Checkbox, FormControlLabel
} from '@mui/material';
import Grid from '@mui/material/Grid2';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DeleteIcon from '@mui/icons-material/Delete';

import { CreateVmForm, VmFormData } from '../components/CreateVmForm';
import { api } from '../services/apiService';
import type { VmList } from '../services/apiService';

export default function VmContent(): JSX.Element {
    const [vms, setVms] = useState<VmList>({});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<string>('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [vmToDelete, setVmToDelete] = useState<string>('');
    const [confirmationName, setConfirmationName] = useState<string>('');
    const [deleteVhd, setDeleteVhd] = useState<boolean>(false);

    useEffect((): (() => void) => {
        const fetchData = async (): Promise<void> => {
            try {
                const vmList = await api.vm.list();
                setVms(vmList);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return (): void => clearInterval(interval);
    }, []);

    const handleDeleteClick = (vmName: string): void => {
        setVmToDelete(vmName);
        setDeleteDialogOpen(true);
        setConfirmationName('');
    };

    const handleDeleteConfirm = async (): Promise<void> => {
        if (confirmationName === vmToDelete) {
            setDeleteDialogOpen(false);
            await handleVmAction('delete', vmToDelete, deleteVhd);
            setVmToDelete('');
            setConfirmationName('');
            setDeleteVhd(false);
        }
    };

    const handleVmAction = async (action: string, vmName: string, deleteVhdFiles?: boolean): Promise<void> => {
        setLoading(vmName);
        setError(null);

        try {
            if (action === 'delete') {
                await api.vm.delete(vmName, deleteVhdFiles);
            } else {
                await api.vm[action](vmName);
            }
            
            if (action === 'stop') {
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        } catch (err: any) {
            setError(`VM Aktion fehlgeschlagen: ${err.message}`);
        } finally {
            setLoading('');
        }
    };

    const handleCreateVm = async (formData: VmFormData): Promise<void> => {
        setLoading('new-vm');
        setError(null);

        try {
            await api.vm.create(formData);
            const vmList = await api.vm.list();
            setVms(vmList);
        } catch (err: any) {
            setError(`VM konnte nicht erstellt werden: ${err.message}`);
        } finally {
            setLoading('');
        }
    };

    const getStatusColor = (state: string): "success" | "error" => {
        return state === '1' ? 'success' : 'error';
    };

    const getStatusText = (state: string): "Aktiv" | "Gestoppt" => {
        return state === '1' ? 'Aktiv' : 'Gestoppt';
    };

    const formatMemory = (memoryKB: string): string => {
        return (parseInt(memoryKB) / 1024 / 1024).toFixed(1) + ' GB';
    };

    return (
        <Box sx={{ flexGrow: 1, p: 4 }}>
            {error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }} >
                        <CreateVmForm onSubmit={handleCreateVm} />
                    </Grid>
                    {Object.entries(vms).map(([vmName, vmData]) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={vmName}>
                            <Card elevation={3}>
                                <CardHeader
                                    title={vmName}
                                    action={
                                        <Chip
                                            label={getStatusText(vmData['state.state'])}
                                            color={getStatusColor(vmData['state.state'])}
                                            size="small"
                                        />
                                    }
                                />
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        RAM: {formatMemory(vmData['balloon.current'])}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        vCPUs: {vmData['vcpu.current']}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Box>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            disabled={vmData['state.state'] === '1' || loading === vmName}
                                            onClick={() => handleVmAction('start', vmName)}
                                        >
                                            <PlayArrowIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            disabled={vmData['state.state'] === '5' || loading === vmName}
                                            onClick={() => handleVmAction('stop', vmName)}
                                        >
                                            <StopIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            disabled={vmData['state.state'] === '5' || loading === vmName}
                                            onClick={() => handleVmAction('reboot', vmName)}
                                        >
                                            <RestartAltIcon />
                                        </IconButton>
                                        {loading === vmName && <CircularProgress size={20} />}
                                    </Box>
                                    <Box sx={{ marginLeft: 'auto' }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDeleteClick(vmName)}
                                        >
                                            <DeleteIcon sx={{ color: 'error.main' }} />
                                        </IconButton>
                                    </Box>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>VM löschen</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Um die VM "{vmToDelete}" zu löschen, geben Sie bitte den Namen der VM ein:
                    </Typography>
                    <TextField
                        fullWidth
                        value={confirmationName}
                        onChange={(e) => setConfirmationName(e.target.value)}
                        error={confirmationName !== '' && confirmationName !== vmToDelete}
                        helperText={confirmationName !== '' && confirmationName !== vmToDelete ?
                            'Name stimmt nicht überein' : ''}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={deleteVhd}
                                onChange={(e) => setDeleteVhd(e.target.checked)}
                                color="error"
                            />
                        }
                        label={
                            <Typography color="error">
                                Auch die zugehörigen VHD-Dateien (*.cow) löschen
                            </Typography>
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        Abbrechen
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        disabled={confirmationName !== vmToDelete}
                        color="error"
                        variant="contained"
                    >
                        Löschen
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
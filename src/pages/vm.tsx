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

import { fetchVmList } from '../services/vmService';
import { fetchData } from '../services/apiService';


interface VmData {
    [key: string]: {
        'state.state': string;
        'state.reason': string;
        'balloon.current': string;
        'vcpu.current': string;
    }
}

export default function VmContent(): JSX.Element {

    const [vms, setVms] = useState<VmData>({});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<string>('');

    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [vmToDelete, setVmToDelete] = useState<string>('');
    const [confirmationName, setConfirmationName] = useState<string>('');
    const [deleteVhd, setDeleteVhd] = useState<boolean>(false);


    useEffect((): (() => void) => {
        const fetchData = async (): Promise<void> => {
            try {
                const vmList = await fetchVmList();
                // Konvertiere die API-Antwort in das richtige Format
                const formattedData: VmData = {};
                Object.entries(vmList).forEach(([name, data]: [string, any]) => {
                    formattedData[name] = {
                        'state.state': data['state.state'],
                        'state.reason': data['state.reason'],
                        'balloon.current': data['balloon.current'],
                        'vcpu.current': data['vcpu.current']
                    };
                });
                setVms(formattedData);
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

// handleDeleteConfirm anpassen
const handleDeleteConfirm = async (): Promise<void> => {
    if (confirmationName === vmToDelete) {
        setDeleteDialogOpen(false);
        // deleteVhd als Parameter mitgeben
        await handleVmAction('delete', vmToDelete, deleteVhd);
        setVmToDelete('');
        setConfirmationName('');
        setDeleteVhd(false);  // Reset
    }
};

    // Timeout für VM-Aktionen
    const VM_ACTION_TIMEOUT = 30000; // 30 Sekunden

    const handleVmAction = async (action: string, vmName: string, deleteVhdFiles?: boolean): Promise<void> => {
        setLoading(vmName);
        setError(null);

        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Aktion hat zu lange gedauert')), VM_ACTION_TIMEOUT);
        });

        try {
            await Promise.race([
                fetchData(`qemu/${action}/${vmName}${deleteVhdFiles? '?delete_vhd=true=true' : ''}`, { method: 'POST' }),
                console.log(action + ' ' + vmName + (deleteVhdFiles? ' with VHD' : '')),
                timeoutPromise
            ]);
            // Minimale Anzeigezeit für Loading bei Stop-Aktion
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
            const response = await fetchData('qemu/create', {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            if (response.status === 'error') {
                throw new Error(response.message);
            }

            // VM-Liste aktualisieren
            const vmList = await fetchVmList();
            // Konvertiere die API-Antwort in das richtige Format
            const formattedData: VmData = {};
            Object.entries(vmList).forEach(([name, data]: [string, any]) => {
                formattedData[name] = {
                    'state.state': data['state.state'],
                    'state.reason': data['state.reason'],
                    'balloon.current': data['balloon.current'],
                    'vcpu.current': data['vcpu.current']
                };
            });
            setVms(formattedData);
        } catch (err: any) {
            setError(`VM konnte nicht erstellt werden: ${err.message}`);
        } finally {
            setLoading('');
        }
    };

    // Status Funktionen
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
                                            disabled={vmData['state.state'] === '1' || loading === vmName}
                                            onClick={() => handleDeleteClick(vmName)}
                                        >
                                            <DeleteIcon sx={{ color: 'error.main' }} />
                                        </IconButton>
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
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
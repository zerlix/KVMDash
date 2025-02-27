import { useState, useEffect, JSX } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import { 
    Box, Card, CardContent, CardHeader, Typography,
    Chip, IconButton, CardActions, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Checkbox, FormControlLabel
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from '../services/apiService';
import { SpiceViewer } from '../components/SpiceViewer';
import { VmDetails } from '../types/vm.types';

export default function VmDetailsPage(): JSX.Element {
    const { vmName } = useParams<{ vmName: string }>();
    const [vmDetails, setVmDetails] = useState<VmDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [confirmationName, setConfirmationName] = useState('');
    const [deleteVhd, setDeleteVhd] = useState(false);
    const navigate = useNavigate(); 

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

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
        setConfirmationName('');
        setDeleteVhd(false);
    };

    const handleDeleteConfirm = async () => {
        if (confirmationName === vmDetails?.name) {
            setDeleteDialogOpen(false);
            await handleVmAction('delete', vmDetails.name);
            navigate('/vm'); 
        }
    };

    const handleVmAction = async (action: string, domain: string): Promise<void> => {
        setActionLoading(domain);
        try {
            await api.post(`qemu/${action}/${domain}`, {});
            await fetchVmDetails();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
            setError(message);
        } finally {
            setActionLoading(null);
        }
    };

    const formatMemory = (memoryKB: string): string => {
        return (parseInt(memoryKB) / 1024 / 1024).toFixed(1) + ' GB';
    };

    useEffect(() => {
        fetchVmDetails();
        const interval = setInterval(fetchVmDetails, 5000);
        return () => clearInterval(interval);
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
                            title={vmDetails.name}
                            action={
                                <Chip
                                    label="Aktiv"
                                    color="success"
                                    size="small"
                                />
                            }
                        />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                RAM: {formatMemory(vmDetails.memory)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                vCPUs: {vmDetails.vcpu}
                            </Typography>
                        </CardContent>
                        <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box>
                                <IconButton
                                    size="small"
                                    color="primary"
                                    disabled={actionLoading === vmDetails.name}
                                    onClick={() => handleVmAction('start', vmDetails.name)}
                                >
                                    <PlayArrowIcon />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    color="error"
                                    disabled={actionLoading === vmDetails.name}
                                    onClick={() => handleVmAction('shutdown', vmDetails.name)}
                                >
                                    <StopIcon />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    color="warning"
                                    disabled={actionLoading === vmDetails.name}
                                    onClick={() => handleVmAction('reboot', vmDetails.name)}
                                >
                                    <RefreshIcon />
                                </IconButton>
                            </Box>
                            <Box sx={{ marginLeft: 'auto' }}>
                                <IconButton
                                    size="small"
                                    onClick={handleDeleteClick}
                                >
                                    <DeleteIcon sx={{ color: 'error.main' }} />
                                </IconButton>
                            </Box>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Card elevation={3}>
                        <CardHeader
                            title="SPICE Remote Konsole"
                            avatar={<DisplaySettingsIcon color="primary" />}
                        />
                        <CardContent>
                            <SpiceViewer
                                host="192.168.0.200"
                                port={parseInt(vmDetails.spice.port) + 1000}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>VM löschen</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Um die VM "{vmDetails.name}" zu löschen, geben Sie bitte den Namen der VM ein:
                    </Typography>
                    <TextField
                        fullWidth
                        value={confirmationName}
                        onChange={(e) => setConfirmationName(e.target.value)}
                        error={confirmationName !== '' && confirmationName !== vmDetails.name}
                        helperText={confirmationName !== '' && confirmationName !== vmDetails.name ?
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
                        disabled={confirmationName !== vmDetails.name}
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
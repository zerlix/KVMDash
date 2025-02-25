import { FC, ReactElement, useState } from 'react';
import { Box, Typography, Card, CardContent, CardHeader, Collapse, IconButton, TextField, Button, Alert, CircularProgress, LinearProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { api } from '../services/apiService';
import type { IsoStatus } from '../types/vm.types';


const SettingsContent: FC = (): ReactElement => {
    const [expanded1, setExpanded1] = useState(false);
    const [expanded2, setExpanded2] = useState(false);
    const [isoUrl, setIsoUrl] = useState('');
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [downloadProgress, setDownloadProgress] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setError('');

        if (!isoUrl.toLowerCase().endsWith('.iso')) {
            setError('Die URL muss auf .iso enden');
            return;
        }

        try {
            setIsUploading(true);
            setDownloadProgress(true);
            setUploadStatus('Download wird gestartet...');

            // Neuer API-Aufruf
            await api.post('iso/upload', { url: isoUrl });

            setUploadStatus('ISO-Download wurde erfolgreich gestartet!');
            checkDownloadStatus();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Fehler beim Senden der Anfrage');
            setDownloadProgress(false);
        } finally {
            setIsUploading(false);
        }
    };

    const checkDownloadStatus = async (): Promise<void> => {
        try {
            const response = await api.get<IsoStatus>('iso/status');
            
            // Vereinfachte Logik:
            if (response?.status === 'success') {
                setDownloadProgress(false);
                setUploadStatus('Download abgeschlossen!');
                return;
            }
            
            // Bei allen anderen Status weitermachen
            setUploadStatus(response?.message || 'Download läuft...');
            setTimeout(checkDownloadStatus, 2000);
            
        } catch {
            // Bei Fehlern weitermachen
            setTimeout(checkDownloadStatus, 2000);
        }
    };

    return (
        <Box sx={{ flexGrow: 1, padding: 4, display: 'grid', gap: 2 }}>
            <Card>
                <CardHeader 
                    sx={{ 
                        backgroundColor: '#853500',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                    onClick={() => setExpanded1(!expanded1)}
                    title="Boot Images"
                    action={
                        <IconButton 
                            sx={{ color: 'white', transform: expanded1 ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    }
                />
                <Collapse in={expanded1}>
                    <CardContent>
                        <Typography component="div">
                            <form onSubmit={handleSubmit}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <TextField
                                        value={isoUrl}
                                        onChange={(e) => setIsoUrl(e.target.value)}
                                        placeholder="https://example.com/image.iso"
                                        label="Boot Image URL"
                                        error={!!error}
                                        helperText={error || 'Bitte geben Sie eine gültige ISO-URL ein'}
                                        fullWidth
                                        disabled={isUploading || downloadProgress}
                                    />
                                    {downloadProgress && (
                                        <Box sx={{ width: '100%' }}>
                                            <LinearProgress />
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                {uploadStatus}
                                            </Typography>
                                        </Box>
                                    )}
                                    {error && (
                                        <Alert severity="error">{error}</Alert>
                                    )}
                                    <Button 
                                        type="submit"
                                        variant="contained"
                                        disabled={isUploading || downloadProgress}
                                        sx={{ 
                                            backgroundColor: '#853500',
                                            '&:hover': {
                                                backgroundColor: '#6b2a00'
                                            }
                                        }}
                                    >
                                        {isUploading ? <CircularProgress size={24} color="inherit" /> : 'Absenden'}
                                    </Button>
                                </Box>
                            </form>
                        </Typography>
                    </CardContent>
                </Collapse>
            </Card>

            <Card>
                <CardHeader 
                    sx={{ 
                        backgroundColor: '#853500',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                    onClick={() => setExpanded2(!expanded2)}
                    title="Benutzereinstellungen"
                    action={
                        <IconButton 
                            sx={{ color: 'white', transform: expanded2 ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    }
                />
                <Collapse in={expanded2}>
                    <CardContent>
                        <Typography>
                        todo...
                        </Typography>
                    </CardContent>
                </Collapse>
            </Card>
        </Box>
    );
}

export default SettingsContent;
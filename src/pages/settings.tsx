import { FC, ReactElement, useState } from 'react';
import { Box, Typography, Card, CardContent, CardHeader, Collapse, IconButton, TextField, Button, Alert } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const SettingsContent: FC = (): ReactElement => {
    const [expanded1, setExpanded1] = useState(false);
    const [expanded2, setExpanded2] = useState(false);
    const [isoUrl, setIsoUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Überprüfen ob die URL auf .iso endet
        if (!isoUrl.toLowerCase().endsWith('.iso')) {
            setError('Die URL muss auf .iso enden');
            return;
        }

        // Überprüfen ob es eine gültige URL ist
        try {
            new URL(isoUrl);
            alert('ISO-URL wurde erfolgreich gespeichert');
        } catch {
            setError('Bitte geben Sie eine gültige URL ein');
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
                                    />
                                    <Button 
                                        type="submit"
                                        variant="contained"
                                        sx={{ 
                                            backgroundColor: '#853500',
                                            '&:hover': {
                                                backgroundColor: '#6b2a00'
                                            }
                                        }}
                                    >
                                        Absenden
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
                            Hier können Benutzereinstellungen angepasst werden.
                        </Typography>
                    </CardContent>
                </Collapse>
            </Card>
        </Box>
    );
}

export default SettingsContent;
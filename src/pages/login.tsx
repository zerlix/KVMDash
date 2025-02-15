import { useState, JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Paper } from '@mui/material';

export default function Login(): JSX.Element {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (): Promise<void> => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });
    
            const data = await response.json();
            
            if (data.status === 'success') {
                localStorage.setItem('token', data.token);
                window.dispatchEvent(new Event('localStorageChanged'));
                setTimeout(() => {
                    navigate('/');
                }, 100);
            } else {
                setError(data.message || 'Login fehlgeschlagen');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Login fehlgeschlagen');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ my: 4 }}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Login
                    </Typography>
                    {error && <Typography color="error">{error}</Typography>}
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}>
                        <TextField
                            label="Benutzername"
                            fullWidth
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            label="Passwort"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button type="submit" variant="contained" color="primary" onClick={handleLogin}>
                            Login
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
}
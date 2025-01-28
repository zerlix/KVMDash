import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Paper } from '@mui/material';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://kvmdash.back/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                localStorage.setItem('token', data.token);
                window.dispatchEvent(new Event('localStorageChanged')); // Erst Event dispatchen
                setTimeout(() => {
                    navigate('/'); // Dann zur Startseite navigieren
                }, 100);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Login fehlgeschlagen');
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
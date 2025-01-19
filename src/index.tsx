import React from 'react'
import ReactDOM from 'react-dom/client'
import { CssBaseline, ThemeProvider} from '@mui/material';
import App from './App'
import kvmTheme from './theme';
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider theme={kvmTheme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </React.StrictMode>,
)
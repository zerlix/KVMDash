import { createTheme, Theme } from '@mui/material/styles';
import { ThemeProvider, CssBaseline } from '@mui/material';
import App from './App';

// Theme Konstanten
const themeColors = {
    primary: {
        main: '#954b1e',     // primary-a10
        light: '#c28c6d',    // primary-a40
        dark: '#853500',     // primary-a0
    },
    background: {
        default: '#121212',  // surface-a0
        paper: '#282828',    // surface-a10
    },
    text: {
        primary: '#ffffff',  // light-a0
        secondary: '#8b8b8b' // surface-a50
    },
    surface: {
        main: '#3f3f3f',    // surface-a20
        light: '#575757',   // surface-a30
        dark: '#282828',    // surface-a10
    },
    surfaceTonal: {
        main: '#72503c',    // surface-tonal-a20
        light: '#9a7e6f',   // surface-tonal-a40
        dark: '#4a250e',    // surface-tonal-a0
    }
};

const theme = createTheme({
    palette: themeColors,
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    backgroundColor: themeColors.background.paper,
                    color: themeColors.text.primary
                }
            }
        },
        MuiCardHeader: {
            styleOverrides: {
                root: {
                    backgroundColor: themeColors.primary.dark,
                    color: themeColors.text.primary
                }
            }
        },

        MuiListItem: {
            styleOverrides: {
                root: {
                    color: themeColors.text.primary,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        backgroundColor: themeColors.surfaceTonal.dark,
                        '& .MuiListItemIcon-root': {
                            color: themeColors.primary.light
                        },
                        '& .MuiListItemText-primary': {
                            color: themeColors.primary.light
                        }
                    }
                }
            }
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    color: themeColors.text.primary,
                    transition: 'color 0.2s ease-in-out'
                }
            }
        },
        MuiListItemText: {
            styleOverrides: {
                primary: {
                    color: themeColors.text.primary,
                    transition: 'color 0.2s ease-in-out'
                }
            }
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: themeColors.text.primary,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        color: themeColors.primary.light,
                        backgroundColor: themeColors.surfaceTonal.dark
                    }
                }
            }
        }
    }
});

export function ThemedApp() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    );
}
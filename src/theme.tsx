import { createTheme } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';

// Erstelle ein benutzerdefiniertes Theme
const kvmDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f0ebd8', // Benutzerdefinierte Primärfarbe
    },
    secondary: {
      main: '#748cab', // Benutzerdefinierte Sekundärfarbe
    },
    background: {
      default: '#000814', // Benutzerdefinierte Hintergrundfarbe
      paper: '#001d3d', // Benutzerdefinierte Papierfarbe
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'linear-gradient(to right top, #000814, #040f1e, #051528, #021932, #001d3d)',
          margin: 0,
          padding: 0,
          height: '100vh',
          overflow: 'hidden',
        },
      },
    },
  },
});

// Erstelle ein weiteres Dark Theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'linear-gradient(to right top, #000000, #050404, #090809, #0c0c0e, #0f1011)',
          margin: 0,
          padding: 0,
          height: '100vh',
          overflow: 'hidden',
        },
      },
    },
  },
});

export { kvmDarkTheme, darkTheme };

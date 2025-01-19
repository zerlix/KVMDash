// Erstelle ein Dark Theme
import { createTheme } from '@mui/material/styles';

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
});

export default kvmDarkTheme;

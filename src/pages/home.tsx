import { JSX  } from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import HostInfo from '../components/host/HostInfo';
import CpuInfo from '../components/host/CpuInfo';
import DiskInfo from '../components/host/DiskInfo'
import MemInfo from '../components/host/MemInfo';

const gridItemStyle = {
    minHeight: '300px',
    minWidth: '500px',    // Minimale Breite für die Cards
    '& .MuiCard-root': {  // Styling für Cards innerhalb der Grid-Items
        height: '100%',    // Card füllt das gesamte Grid-Item
        width: '100%'      // Card nimmt volle verfügbare Breite
    }
};


// Home Page
export default function HomeContent(): JSX.Element {
    return (
        <Box sx={{ flexGrow: 1, padding: 4 }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }} sx={gridItemStyle}>
                    <HostInfo />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }} sx={gridItemStyle}>
                    <MemInfo />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }} sx={gridItemStyle}>
                    <DiskInfo />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }} sx={gridItemStyle}>
                    <CpuInfo />
                </Grid>
            </Grid>
        </Box>
    );
}
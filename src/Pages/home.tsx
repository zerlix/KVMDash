import { Box, Card, Typography, Paper, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid2';
import HostInfo from '../Components/HostInfo';
import CpuInfo from '../Components/CpuInfo';
import DiskInfo from '../Components/DiskInfo'
import MemInfo from '../Components/MemInfo';


// Home Page
export default function HomeContent() {
    return (
        <Box sx={{ flexGrow: 1, padding: 4 }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <HostInfo />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <MemInfo />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <DiskInfo />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <CpuInfo />
                </Grid>
                
            </Grid>
        </Box>
    );
}

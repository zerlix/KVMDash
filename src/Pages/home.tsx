import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import HostInfo from '../Components/HostInfo';
import CpuInfo from '../Components/CpuInfo';
import DiskInfo from '../Components/DiskInfo'
import MemInfo from '../Components/MemInfo';
import { SpiceViewer } from '../Components/SpiceViewer';

// Home Page
export default function HomeContent() {
    return (
        <Box sx={{ flexGrow: 1, padding: 4 }}>
            SpiceTest
            <SpiceViewer
                host="192.168.0.200"
                port={6080}
                password="optional-password"
            />

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

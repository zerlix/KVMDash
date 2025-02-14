import { JSX  } from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import HostInfo from '../components/HostInfo';
import CpuInfo from '../components/CpuInfo';
import DiskInfo from '../components/DiskInfo'
import MemInfo from '../components/MemInfo';

// Home Page
export default function HomeContent(): JSX.Element {


    return (
        <Box sx={{ flexGrow: 1, padding: 4 }}>
            <Grid container spacing={2}>
                <Grid sx={{ xs: 12, md: 6 }}>
                    <HostInfo />
                </Grid>
                <Grid sx={{ xs: 12, md: 6 }}>
                    <MemInfo />
                </Grid>
                <Grid sx={{ xs: 12, md: 6 }}>
                    <DiskInfo />
                </Grid>
                <Grid sx={{ xs: 12, md: 6 }}>
                    <CpuInfo />
                </Grid>
            </Grid>
        </Box>
    );
}
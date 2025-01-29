import { Box, Card, Typography, Paper, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid2';
import HostInfo from '../Components/HostInfo';
import CpuInfo from '../Components/CpuInfo';

const Item = styled(Paper)(({ theme }) => ({

}));

// Home Page
export default function HomeContent() {


    return (
        <Box sx={{ flexGrow: 1, padding: 4 }}>
            <HostInfo />
            <CpuInfo />
        </Box>

    
);


}
import { Box, Card, Typography, Paper, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid2';

const Item = styled(Paper)(({ theme }) => ({

}));

// Home Page
export default function HomeContent() {


    return (
        <Box sx={{ flexGrow: 1, padding: 4 }}>

            <Item>
                <Card variant="outlined" sx={{ width: '100%' }}>
                    <CardContent>
                        <Typography component="h2" variant="subtitle2" gutterBottom>
                            Hostname
                        </Typography>
                        192.168.0.200
                        
                    </CardContent>
                </Card>
            </Item>
        
        </Box>

    
);


}
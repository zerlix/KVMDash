import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';

export function VmCpuInfo() {
    return (
        <Card elevation={3}>
            <CardHeader
                title={<Typography variant="h6">CPU Information</Typography>}
                avatar={<DeveloperBoardIcon color="primary" />}
            />
            <CardContent>
                <Typography>CPU Details folgen...</Typography>
            </CardContent>
        </Card>
    );
}

import { JSX } from 'react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory';

export function VmMemInfo(): JSX.Element {
    return (
        <Card elevation={3}>
            <CardHeader
                title={<Typography variant="h6">Arbeitsspeicher</Typography>}
                avatar={<MemoryIcon color="primary" />}
            />
            <CardContent>
                <Typography>Speicherinformationen folgen...</Typography>
            </CardContent>
        </Card>
    );
}

import { JSX } from 'react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';

export function VmDiskInfo(): JSX.Element  {
    return (
        <Card elevation={3}>
            <CardHeader
                title={<Typography variant="h6">Festplatten</Typography>}
                avatar={<StorageIcon color="primary" />}
            />
            <CardContent>
                <Typography>Festplatteninformationen folgen...</Typography>
            </CardContent>
        </Card>
    );
}

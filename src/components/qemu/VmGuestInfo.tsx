import { JSX } from 'react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

export function VmGuestInfo(): JSX.Element  {
    return (
        <Card elevation={3}>
            <CardHeader
                title={<Typography variant="h6">Gast Informationen</Typography>}
                avatar={<PersonIcon color="primary" />}
            />
            <CardContent>
                <Typography>Gast Informationen folgen...</Typography>
            </CardContent>
        </Card>
    );
}

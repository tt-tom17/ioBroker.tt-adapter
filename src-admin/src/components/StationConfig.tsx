import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { I18n } from '@iobroker/adapter-react-v5';

interface Station {
    id: string;
    name: string;
}

interface StationConfigProps {
    station: Station | null;
}

const StationConfig: React.FC<StationConfigProps> = ({ station }) => {
    return (
        <Paper sx={{ p: 2, height: '100%' }}>
            <Typography
                variant="h6"
                sx={{ mb: 2 }}
            >
                {I18n.t('Station Configuration')}
            </Typography>

            {station ? (
                <Box>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {I18n.t('Configuration for station')}: {station.name}
                    </Typography>
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            {I18n.t('Configuration component will be implemented here')}
                        </Typography>
                    </Box>
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '80%',
                        color: 'text.secondary',
                    }}
                >
                    <Typography variant="body2">{I18n.t('Select a station from the list to configure it')}</Typography>
                </Box>
            )}
        </Paper>
    );
};

export default StationConfig;

import { I18n } from '@iobroker/adapter-react-v5';
import { Box, FormControlLabel, Paper, Switch, TextField, Typography } from '@mui/material';
import React from 'react';

interface Station {
    id: string;
    name: string;
    customName?: string;
    enabled?: boolean;
    updateInterval?: number;
}

interface StationConfigProps {
    station: Station | null;
    onUpdate?: (stationId: string, updates: Partial<Station>) => void;
}

const StationConfig: React.FC<StationConfigProps> = ({ station, onUpdate }) => {
    const handleCustomNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (station && onUpdate) {
            onUpdate(station.id, { customName: event.target.value });
        }
    };

    const handleEnabledChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (station && onUpdate) {
            onUpdate(station.id, { enabled: event.target.checked });
        }
    };

    const handleIntervalChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (station && onUpdate) {
            const value = parseInt(event.target.value, 10);
            if (!isNaN(value) && value > 0) {
                onUpdate(station.id, { updateInterval: value });
            }
        }
    };

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
                        sx={{ mb: 3 }}
                    >
                        {I18n.t('Configuration for station')}: {station.name}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* Station ID (read-only) */}
                        <TextField
                            label={I18n.t('Station ID')}
                            value={station.id}
                            disabled
                            fullWidth
                            size="small"
                        />

                        {/* Original Name (read-only) */}
                        <TextField
                            label={I18n.t('Original Name')}
                            value={station.name}
                            disabled
                            fullWidth
                            size="small"
                        />

                        {/* Custom Name */}
                        <TextField
                            label={I18n.t('Custom Name')}
                            value={station.customName || station.name}
                            onChange={handleCustomNameChange}
                            fullWidth
                            size="small"
                            helperText={I18n.t('Enter a custom name for this station')}
                        />

                        {/* Enabled Switch */}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={station.enabled !== false}
                                    onChange={handleEnabledChange}
                                />
                            }
                            label={I18n.t('Enable station updates')}
                        />

                        {/* Update Interval */}
                        <TextField
                            label={I18n.t('Update Interval (seconds)')}
                            type="number"
                            value={station.updateInterval || 60}
                            onChange={handleIntervalChange}
                            fullWidth
                            size="small"
                            inputProps={{ min: 10, max: 3600 }}
                            helperText={I18n.t('How often to fetch departures (10-3600 seconds)')}
                        />
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

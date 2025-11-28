import { I18n } from '@iobroker/adapter-react-v5';
import { ConfigGeneric, type ConfigGenericProps, type ConfigGenericState } from '@iobroker/json-config';
import type { SelectChangeEvent } from '@mui/material';
import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React from 'react';

class HafasConfig extends ConfigGeneric<ConfigGenericProps, ConfigGenericState> {
    constructor(props: ConfigGenericProps) {
        super(props);
        this.state = {
            ...this.state,
        };
    }

    renderItem(_error: string, disabled: boolean): React.ReactElement {
        // Use ConfigGeneric.getValue to safely get values
        const hafasProfile = ConfigGeneric.getValue(this.props.data, 'hafasProfile') as string;
        const clientName = ConfigGeneric.getValue(this.props.data, 'clientName') as string;

        const handleProfileChange = async (event: SelectChangeEvent<string>): Promise<void> => {
            const newValue = event.target.value;
            await this.onChange('hafasProfile', newValue);
        };

        const handleClientNameChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
            const newValue = event.target.value;
            await this.onChange('clientName', newValue);
        };

        return (
            <Box sx={{ p: { xs: 1, sm: 2 }, maxWidth: 1200, mx: 'auto' }}>
                <Typography
                    variant="h5"
                    sx={{ mb: { xs: 2, sm: 3 }, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                >
                    {I18n.t('hafasConfig_title')}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
                    <FormControl
                        sx={{ flex: { sm: '1 1 0' }, minWidth: { xs: '100%', sm: 200 } }}
                        disabled={disabled}
                        fullWidth
                    >
                        <InputLabel id="hafas-profile-label">{I18n.t('hafasConfig_profile_label')}</InputLabel>
                        <Select
                            labelId="hafas-profile-label"
                            id="hafas-profile-select"
                            value={hafasProfile || ''}
                            label={I18n.t('hafasConfig_profile_label')}
                            onChange={handleProfileChange}
                        >
                            <MenuItem value="vbb">{I18n.t('hafasConfig_profile_vbb')}</MenuItem>
                            <MenuItem value="db">{I18n.t('hafasConfig_profile_db')}</MenuItem>
                        </Select>
                        <FormHelperText>{I18n.t('hafasConfig_profile_helper')}</FormHelperText>
                    </FormControl>

                    <FormControl
                        sx={{ flex: { sm: '1 1 0' }, minWidth: { xs: '100%', sm: 200 } }}
                        disabled={disabled}
                        fullWidth
                    >
                        <TextField
                            id="client-name-input"
                            label={I18n.t('hafasConfig_clientName_label')}
                            value={clientName || ''}
                            onChange={handleClientNameChange}
                            helperText={I18n.t('hafasConfig_clientName_helper')}
                            disabled={disabled}
                            fullWidth
                        />
                    </FormControl>
                </Box>
            </Box>
        );
    }
}

export default HafasConfig;

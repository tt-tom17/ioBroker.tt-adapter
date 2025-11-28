import { I18n } from '@iobroker/adapter-react-v5';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Box, Button, IconButton, List, ListItemButton, ListItemText, Paper, Typography } from '@mui/material';
import React from 'react';

interface Station {
    id: string;
    name: string;
}

interface StationListProps {
    stations: Station[];
    selectedStationId: string | null;
    onAddStation: () => void;
    onDeleteStation: (stationId: string) => void;
    onStationClick: (stationId: string) => void;
}

const StationList: React.FC<StationListProps> = ({
    stations,
    selectedStationId,
    onAddStation,
    onDeleteStation,
    onStationClick,
}) => {
    return (
        <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{I18n.t('Stations Overview')}</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onAddStation}
                    size="small"
                >
                    {I18n.t('Add Station')}
                </Button>
            </Box>

            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                {stations.length === 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            color: 'text.secondary',
                        }}
                    >
                        <Typography variant="body2">
                            {I18n.t('No stations configured. Click "Add Station" to get started.')}
                        </Typography>
                    </Box>
                ) : (
                    <List>
                        {stations.map(station => (
                            <ListItemButton
                                key={station.id}
                                selected={selectedStationId === station.id}
                                sx={{
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    mb: 1,
                                    '&.Mui-selected': {
                                        backgroundColor: 'action.selected',
                                    },
                                }}
                                onClick={() => onStationClick(station.id)}
                            >
                                <ListItemText
                                    primary={station.name}
                                    secondary={`ID: ${station.id}`}
                                    primaryTypographyProps={{ fontWeight: 500 }}
                                    secondaryTypographyProps={{ variant: 'caption' }}
                                />
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={e => {
                                        e.stopPropagation();
                                        onDeleteStation(station.id);
                                    }}
                                    size="small"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemButton>
                        ))}
                    </List>
                )}
            </Box>
        </Paper>
    );
};

export default StationList;

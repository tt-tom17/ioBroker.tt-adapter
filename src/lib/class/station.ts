import type * as Hafas from 'hafas-client';
import type { TTAdapter } from '../../main';
import { genericStateObjects } from '../const/definition';
import { BaseClass } from '../tools/library';
import { mapStationToStationState } from '../tools/mapper';

export class StationRequest extends BaseClass {
    constructor(adapter: TTAdapter) {
        super(adapter);
        this.log.setLogPrefix('station');
    }

    public async getStation(
        stationId: string,
        service: any,
        options?: Hafas.StopOptions,
    ): Promise<Hafas.Station | Hafas.Stop | Hafas.Location> {
        try {
            if (!stationId) {
                throw new Error('Keine stationId übergeben');
            }
            if (!service) {
                throw new Error('Kein Service übergeben');
            }
            const station = await service.getStop(stationId, options);
            // Vollständiges JSON für Debugging
            this.adapter.log.debug(JSON.stringify(station, null, 1));
            await this.library.writedp(
                `${this.adapter.namespace}.Stations.${stationId}.info.json`,
                JSON.stringify(station),
                {
                    _id: 'nicht_definieren',
                    type: 'state',
                    common: {
                        name: 'raw station data',
                        type: 'string',
                        role: 'json',
                        read: true,
                        write: false,
                    },
                    native: {},
                },
            );
            const stationState = mapStationToStationState(station);
            // JSON in die States schreiben
            await this.library.writeFromJson(
                `${this.adapter.namespace}.Stations.${stationId}.info`,
                'station',
                genericStateObjects,
                stationState,
                true,
            );
            return station;
        } catch (err) {
            this.log.error(`Fehler bei der Abfrage der Station ${stationId}: ${(err as Error).message}`);
            throw err;
        }
    }
}

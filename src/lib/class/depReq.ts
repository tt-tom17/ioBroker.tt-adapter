import type { TTAdapter } from '../../main';
import { genericStateObjects } from '../const/definition';
import { BaseClass } from '../tools/library';
import { mapDeparturesToDepartureStates } from '../tools/mapper';
import { defaultDepartureOpt, type DeparturesResponse } from '../types/types';

export class DepartureRequest extends BaseClass {
    response: DeparturesResponse;
    constructor(adapter: TTAdapter) {
        super(adapter);
        this.response = {} as DeparturesResponse;
    }

    public async getDepartures(stationId?: string): Promise<void> {
        try {
            if (!stationId) {
                throw new Error('Keine stationId übergeben');
            }
            const hService = this.adapter.hService;
            const options = { ...defaultDepartureOpt };
            // Antwort von HAFAS als vollständiger Typ
            this.response = await hService.getDepartures(stationId, options);
            // Vollständiges JSON für Debugging
            this.adapter.log.info(JSON.stringify(this.response.departures, null, 1));
            // Konvertiere zu reduzierten States
            const departureStates = mapDeparturesToDepartureStates(this.response.departures);
            await this.library.cleanUpTree([`${this.adapter.namespace}`], null, 1);
            // JSON in die States schreiben
            await this.library.writeFromJson('departures', 'departures', genericStateObjects, departureStates, true);
        } catch (error) {
            this.log.error(`Fehler bei der Abfrage der Abfahrten: ${(error as Error).message}`);
            throw error;
        }
    }
}

import type { TTAdapter } from '../../main';
import { defaultFolder, genericStateObjects } from '../const/definition';
import { BaseClass } from '../tools/library';
import { mapDeparturesToDepartureStates } from '../tools/mapper';
import { defaultDepartureOpt, type DeparturesResponse } from '../types/types';

export class DepartureRequest extends BaseClass {
    response: DeparturesResponse;
    constructor(adapter: TTAdapter) {
        super(adapter);
        this.response = {} as DeparturesResponse;
    }
    /**
     *  Ruft Abfahrten für eine gegebene stationId ab und schreibt sie in die States.
     *
     * @param stationId     Die ID der Station, für die Abfahrten abgefragt werden sollen.
     * @param options      Zusätzliche Optionen für die Abfrage.
     */
    public async getDepartures(stationId: string, options: any = {}): Promise<void> {
        try {
            if (!stationId) {
                throw new Error('Keine stationId übergeben');
            }
            const hService = this.adapter.hService;
            const mergedOptions = { ...defaultDepartureOpt, ...options };
            // Antwort von HAFAS als vollständiger Typ
            this.response = await hService.getDepartures(stationId, mergedOptions);
            // Vollständiges JSON für Debugging
            this.adapter.log.info(JSON.stringify(this.response.departures, null, 1));
            // Stations Ordner erstellen
            await this.library.writedp(`${this.adapter.namespace}.${stationId}`, undefined, defaultFolder);
            // Konvertiere zu reduzierten States
            const departureStates = mapDeparturesToDepartureStates(this.response.departures);
            // Vor dem Schreiben alte States löschen
            await this.library.cleanUpTree([`${this.adapter.namespace}.${stationId}`], null, 1);
            // JSON in die States schreiben
            await this.library.writeFromJson(
                `${this.adapter.namespace}.${stationId}.`,
                'departures',
                genericStateObjects,
                departureStates,
                true,
            );
        } catch (error) {
            this.log.error(`Fehler bei der Abfrage der Abfahrten: ${(error as Error).message}`);
            throw error;
        }
    }
}

import type * as Hafas from 'hafas-client';
import type { TTAdapter } from '../../main';
import { defaultFolder, genericStateObjects } from '../const/definition';
import { BaseClass } from '../tools/library';
import { mapDeparturesToDepartureStates } from '../tools/mapper';
import { defaultDepartureOpt, type Departure, type DeparturesResponse, type Products } from '../types/types';

export class DepartureRequest extends BaseClass {
    response: DeparturesResponse;
    constructor(adapter: TTAdapter) {
        super(adapter);
        this.response = {} as DeparturesResponse;
        this.log.setLogPrefix('depReq');
    }
    /**
     *  Ruft Abfahrten für eine gegebene stationId ab und schreibt sie in die States.
     *
     * @param stationId     Die ID der Station, für die Abfahrten abgefragt werden sollen.
     * @param service      Der Service für die Abfrage.
     * @param options      Zusätzliche Optionen für die Abfrage.
     * @param products    Die aktivierten Produkte (true = erlaubt)
     */
    public async getDepartures(
        stationId: string,
        service: any,
        options: Hafas.DeparturesArrivalsOptions = {},
        products?: Partial<Products>,
    ): Promise<boolean> {
        try {
            if (!stationId) {
                throw new Error('Keine stationId übergeben');
            }
            const mergedOptions = { ...defaultDepartureOpt, ...options };
            // Antwort von HAFAS als vollständiger Typ
            this.response = await service.getDepartures(stationId, mergedOptions);
            // Vollständiges JSON für Debugging
            this.adapter.log.debug(JSON.stringify(this.response.departures, null, 1));
            // Stations Ordner erstellen
            await this.library.writedp(
                `${this.adapter.namespace}.Stations.${stationId}.Departures`,
                undefined,
                defaultFolder,
            );
            // Filtere nach Produkten, falls angegeben
            if (products) {
                this.response.departures = this.filterByProducts(this.response.departures, products);
            }
            // Konvertiere zu reduzierten States
            const departureStates = mapDeparturesToDepartureStates(this.response.departures);
            // Vor dem Schreiben alte States löschen
            await this.library.garbageColleting(`${this.adapter.namespace}.Stations.${stationId}.Departures.`, 2000);
            // JSON in die States schreiben
            await this.library.writeFromJson(
                `${this.adapter.namespace}.Stations.${stationId}.Departures.`,
                'departures',
                genericStateObjects,
                departureStates,
                true,
            );
            //await this.getStop(stationId, service);
            return true;
        } catch (error) {
            this.log.error(
                `Fehler bei der Abfrage der Abfahrten für Station ${stationId}: ${(error as Error).message}`,
            );
            return false;
        }
    }

    private async getStop(
        stationId: string,
        service: any,
        options?: Hafas.StopOptions,
    ): Promise<Hafas.Station | Hafas.Stop | Hafas.Location> {
        if (!stationId) {
            throw new Error('Keine stationId übergeben');
        }
        if (!service) {
            throw new Error('Kein Service übergeben');
        }
        const stop = await service.getStop(stationId, options);
        // Vollständiges JSON für Debugging
        this.adapter.log.debug(JSON.stringify(stop, null, 1));
        // JSON in die States schreiben
        await this.library.writeFromJson(
            `${this.adapter.namespace}.Stations.${stationId}.`,
            'departures',
            genericStateObjects,
            stop,
            true,
        );
        return stop;
    }

    /**
     * Filtert Abfahrten nach den gewählten Produkten.
     * Es werden nur Abfahrten zurückgegeben, deren Produkt in den aktivierten Produkten enthalten ist.
     *
     * @param departures    Die zu filternden Abfahrten
     * @param products      Die aktivierten Produkte (true = erlaubt)
     * @returns             Gefilterte Abfahrten
     */
    filterByProducts(departures: Departure[], products: Partial<Products>): Departure[] {
        // Erstelle eine Liste der aktivierten Produktnamen
        const enabledProducts = Object.entries(products)
            .filter(([_, enabled]) => enabled === true)
            .map(([productName, _]) => productName);

        // Wenn keine Produkte aktiviert sind, gib alle zurück
        if (enabledProducts.length === 0) {
            return departures;
        }

        // Filtere Abfahrten: behalte nur die, deren line.product in enabledProducts ist
        return departures.filter(departure => {
            const lineProduct = departure.line?.product;
            if (!lineProduct) {
                this.log.info(
                    `Abfahrt ${departure.line?.name || 'unbekannt'} Richtung ${departure.direction} gefiltert: Keine Produktinfo vorhanden`,
                );
                return false;
            }
            const isEnabled = enabledProducts.includes(lineProduct);
            if (!isEnabled) {
                this.log.info(
                    `Abfahrt ${departure.line?.name} Richtung ${departure.direction} gefiltert: Produkt "${lineProduct}" nicht aktiviert`,
                );
            }
            return isEnabled;
        });
    }
}

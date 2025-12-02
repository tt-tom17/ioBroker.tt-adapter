import type {
    Departures,
    DeparturesArrivalsOptions,
    Journeys,
    JourneysOptions,
    Location,
    LocationsOptions,
    Station,
    Stop,
} from 'hafas-client';

/**
 * Gemeinsames Interface für Transport-Services (HAFAS und Vendo)
 */
export interface ITransportService {
    init(): void;
    getLocations(query: string, options?: LocationsOptions): Promise<ReadonlyArray<Station | Stop | Location>>;
    getDepartures(stationId: string, options?: DeparturesArrivalsOptions): Promise<Departures>;
    getRoute(fromId: string, toId: string, options?: JourneysOptions): Promise<Journeys>;
    // Weitere gemeinsame Methoden hier hinzufügen
}

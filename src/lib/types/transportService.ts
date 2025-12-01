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
 * Gemeinsames Interface für HafasService und VendoService.
 * Ermöglicht die austauschbare Verwendung beider Services.
 */
export interface ITransportService {
    getLocations(query: string, options?: LocationsOptions): Promise<ReadonlyArray<Station | Stop | Location>>;
    getDepartures(stationId: string, options?: DeparturesArrivalsOptions): Promise<Departures>;
    getRoute(fromId: string, toId: string, options?: JourneysOptions): Promise<Journeys>;
}

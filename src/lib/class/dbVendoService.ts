import { createClient } from 'db-vendo-client';
import { profile as dbProfile } from 'db-vendo-client/p/db/index.js';
import { profile as dbNavProfile } from 'db-vendo-client/p/dbnav/index.js';
import type {
    Departures,
    DeparturesArrivalsOptions,
    HafasClient,
    Journeys,
    JourneysOptions,
    Location,
    LocationsOptions,
    Station,
    Stop,
} from 'hafas-client';

export class VendoService {
    private navClient: HafasClient;
    private dbClient: HafasClient;

    constructor(clientName: string) {
        this.navClient = createClient(dbNavProfile, clientName);
        this.dbClient = createClient(dbProfile, clientName);
    }

    async getLocations(query: string, options?: LocationsOptions): Promise<ReadonlyArray<Station | Stop | Location>> {
        return this.navClient.locations(query, options);
    }

    async getDepartures(stationId: string, options?: DeparturesArrivalsOptions): Promise<Departures> {
        return this.navClient.departures(stationId, options);
    }

    async getRoute(fromId: string, toId: string, options?: JourneysOptions): Promise<Journeys> {
        return this.navClient.journeys(fromId, toId, options);
    }
}

/**
 * HafasService - kleiner Wrapper um `hafas-client`.
 *
 * Kapselt die Client-Erzeugung und bietet einfache asynchrone Methoden
 * für `locations` und `departures` an.
 */
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
import { createClient as hafasClient } from 'hafas-client';
import { profile as dbProfile } from 'hafas-client/p/db/index.js';
import { profile as vbbProfile } from 'hafas-client/p/vbb/index.js';
import type { ITransportService } from '../types/transportService';

export class HafasService implements ITransportService {
    private client: ReturnType<typeof hafasClient>;

    /**
     * Erzeugt eine neue Instanz des HafasService.
     * Standardmäßig wird das VBB-Profil verwendet. Optional kann ein alternatives
     * Profil als zweiten Parameter übergeben werden (für Tests oder andere Netze).
     *
     * @param clientName optionaler Name, der an den Client übergeben wird
     * @param profile optionales HAFAS-Profil; falls nicht angegeben, wird vbbProfile genutzt
     */
    constructor(clientName: string, profile?: string) {
        const usedProfile = this.resolveProfile(profile);
        this.client = hafasClient(usedProfile, clientName);
    }

    /**
     * Resolve a profile given either a ProfileName or a profile object.
     * Falls `profile` leer ist, wird `vbbProfile` verwendet.
     *
     * @param profile entweder ein Eintrag aus `ProfileName` oder ein Profil-Objekt
     * @returns das aufgelöste Profil-Objekt
     */
    private resolveProfile(profile?: string): any {
        if (!profile) {
            return vbbProfile;
        }

        switch (profile) {
            case 'vbb': {
                return vbbProfile;
            }
            case 'db': {
                return dbProfile;
            }
            default: {
                throw new Error(
                    `Unbekanntes Profile: ${String(
                        profile,
                    )}. Nutze entweder ein Profil-Objekt oder einen Namen aus ProfileName.`,
                );
            }
        }
    }

    /**
     * Suche nach Orten/Stationen.
     *
     * @param query Suchbegriff für Orte/Stationen
     * @param options optionale Suchoptionen
     * @returns Promise mit Suchergebnissen
     */
    async getLocations(query: string, options?: LocationsOptions): Promise<ReadonlyArray<Station | Stop | Location>> {
        return this.client.locations(query, options);
    }

    /**
     * Liefert Abfahrten für eine gegebene Stations-ID.
     *
     * @param stationId ID der Station
     * @param options optionale Abfrage-Optionen
     * @returns Promise mit Abfahrtsinformationen
     */
    async getDepartures(stationId: string, options?: DeparturesArrivalsOptions): Promise<Departures> {
        return this.client.departures(stationId, options);
    }

    /**
     * Liefert Routeninformationen zwischen zwei Stationen.
     *
     * @param fromId ID der Startstation
     * @param toId ID der Zielstation
     * @param options optionale Routen-Optionen
     * @returns Promise mit Routeninformationen
     */
    async getRoute(fromId: string, toId: string, options?: JourneysOptions): Promise<Journeys> {
        return this.client.journeys(fromId, toId, options);
    }
}

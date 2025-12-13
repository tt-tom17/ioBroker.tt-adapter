import type * as Hafas from 'hafas-client';
import type { DepartureState, JourneyState, StationState } from '../types/types';
/**
 * Gruppiert Remarks nach Typ und fasst deren Texte zusammen
 *
 * @param remarks Array von Remark Objekten
 */
function groupRemarksByType(remarks: readonly (Hafas.Hint | Hafas.Status | Hafas.Warning)[]): {
    hint: string | undefined;
    warning: string | undefined;
    status: string | undefined;
} {
    const hints: string[] = [];
    const warnings: string[] = [];
    const statuses: string[] = [];

    for (const remark of remarks) {
        switch (remark.type) {
            case 'hint':
                hints.push(remark.text ?? '');
                break;
            case 'warning':
                warnings.push(remark.text ?? '');
                break;
            case 'status':
                statuses.push(remark.text ?? '');
                break;
        }
    }

    return {
        hint: hints.length > 0 ? hints.join('\n') : undefined,
        warning: warnings.length > 0 ? warnings.join('\n') : undefined,
        status: statuses.length > 0 ? statuses.join('\n') : undefined,
    };
}

/**
 * Konvertiert HAFAS Departure zu reduzierten DepartureState
 *
 * @param departure HAFAS Departure Objekt
 */
export function mapDepartureToDepartureState(departure: Hafas.Alternative): DepartureState {
    return {
        when: departure.when ?? undefined,
        plannedWhen: departure.plannedWhen ?? undefined,
        delay: departure.delay ?? undefined,
        direction: departure.direction ?? undefined,
        platform: departure.platform ?? undefined,
        plannedPlatform: departure.plannedPlatform ?? undefined,
        line: {
            name: departure.line?.name ?? undefined,
            fahrtNr: departure.line?.fahrtNr ?? undefined,
            productName: departure.line?.productName ?? undefined,
            mode: departure.line?.mode ?? undefined,
            operator: departure.line?.operator?.name ?? undefined,
        },
        remarks: groupRemarksByType(departure.remarks ?? []),
        stopinfo: {
            name: departure.stop?.name ?? undefined,
            id: departure.stop?.id ?? undefined,
            type: departure.stop?.type ?? undefined,
            location: departure.stop?.location
                ? {
                      latitude: departure.stop.location.latitude ?? undefined,
                      longitude: departure.stop.location.longitude ?? undefined,
                  }
                : undefined,
        },
    };
}

/**
 * Konvertiert Array von Departures zu Array von DepartureStates
 *
 * @param departures Array von HAFAS Departure Objekten
 */
export function mapDeparturesToDepartureStates(departures: readonly Hafas.Alternative[]): DepartureState[] {
    return departures.map(mapDepartureToDepartureState);
}

/**
 * Konvertiert DeparturesResponse zu Array von DepartureStates
 *
 * @param response HAFAS DeparturesResponse Objekt
 */
export function mapDeparturesResponseToStates(response: Hafas.Departures): DepartureState[] {
    return mapDeparturesToDepartureStates(response.departures);
}

export function mapStationToStationState(station: Hafas.Station | Hafas.Stop): StationState {
    return {
        name: station.name,
        id: station.id,
        type: station.type,
        location: station.location
            ? {
                  latitude: station.location.latitude,
                  longitude: station.location.longitude,
              }
            : undefined,
    };
}

export function mapJourneyToJourneyState(journey: Hafas.Journeys): JourneyState {
    return {
        legs:
            journey.journeys?.flatMap(
                j =>
                    j.legs?.map(leg => ({
                        stationFrom: {
                            id: leg.origin?.id ?? undefined,
                            name: leg.origin?.name ?? undefined,
                            type: leg.origin?.type ?? undefined,
                            location:
                                leg.origin?.type === 'station' || leg.origin?.type === 'stop'
                                    ? leg.origin.location
                                        ? {
                                              latitude: leg.origin.location.latitude ?? undefined,
                                              longitude: leg.origin.location.longitude ?? undefined,
                                          }
                                        : undefined
                                    : undefined,
                        },
                        stationTo: {
                            id: leg.destination?.id ?? undefined,
                            name: leg.destination?.name ?? undefined,
                            type: leg.destination?.type ?? undefined,
                            location:
                                leg.destination?.type === 'station' || leg.destination?.type === 'stop'
                                    ? leg.destination.location
                                        ? {
                                              latitude: leg.destination.location.latitude ?? undefined,
                                              longitude: leg.destination.location.longitude ?? undefined,
                                          }
                                        : undefined
                                    : undefined,
                        },
                        departure: leg.departure ?? undefined,
                        plannedDeparture: leg.plannedDeparture ?? undefined,
                        departureDelay: leg.departureDelay ?? undefined,
                        arrival: leg.arrival ?? undefined,
                        plannedArrival: leg.plannedArrival ?? undefined,
                        arrivalDelay: leg.arrivalDelay ?? undefined,
                        line: leg.line
                            ? {
                                  name: leg.line.name ?? undefined,
                                  fahrtNr: leg.line.fahrtNr ?? undefined,
                                  productName: leg.line.productName ?? undefined,
                                  mode: leg.line.mode ?? undefined,
                                  operator: leg.line.operator?.name ?? undefined,
                              }
                            : undefined,
                        direction: leg.direction ?? undefined,
                        arrivalPlatform: leg.arrivalPlatform ?? undefined,
                        plannedArrivalPlatform: leg.plannedArrivalPlatform ?? undefined,
                        departurePlatform: leg.departurePlatform ?? undefined,
                        plannedDeparturePlatform: leg.plannedDeparturePlatform ?? undefined,
                        remarks: leg.remarks ? groupRemarksByType(leg.remarks) : undefined,
                    })) ?? [],
            ) ?? undefined,
    };
}

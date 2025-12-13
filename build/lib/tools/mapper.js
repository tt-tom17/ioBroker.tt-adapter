"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var mapper_exports = {};
__export(mapper_exports, {
  mapDepartureToDepartureState: () => mapDepartureToDepartureState,
  mapDeparturesResponseToStates: () => mapDeparturesResponseToStates,
  mapDeparturesToDepartureStates: () => mapDeparturesToDepartureStates,
  mapJourneyToJourneyState: () => mapJourneyToJourneyState,
  mapStationToStationState: () => mapStationToStationState
});
module.exports = __toCommonJS(mapper_exports);
function groupRemarksByType(remarks) {
  var _a, _b, _c;
  const hints = [];
  const warnings = [];
  const statuses = [];
  for (const remark of remarks) {
    switch (remark.type) {
      case "hint":
        hints.push((_a = remark.text) != null ? _a : "");
        break;
      case "warning":
        warnings.push((_b = remark.text) != null ? _b : "");
        break;
      case "status":
        statuses.push((_c = remark.text) != null ? _c : "");
        break;
    }
  }
  return {
    hint: hints.length > 0 ? hints.join("\n") : void 0,
    warning: warnings.length > 0 ? warnings.join("\n") : void 0,
    status: statuses.length > 0 ? statuses.join("\n") : void 0
  };
}
function mapDepartureToDepartureState(departure) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A;
  return {
    when: (_a = departure.when) != null ? _a : void 0,
    plannedWhen: (_b = departure.plannedWhen) != null ? _b : void 0,
    delay: (_c = departure.delay) != null ? _c : void 0,
    direction: (_d = departure.direction) != null ? _d : void 0,
    platform: (_e = departure.platform) != null ? _e : void 0,
    plannedPlatform: (_f = departure.plannedPlatform) != null ? _f : void 0,
    line: {
      name: (_h = (_g = departure.line) == null ? void 0 : _g.name) != null ? _h : void 0,
      fahrtNr: (_j = (_i = departure.line) == null ? void 0 : _i.fahrtNr) != null ? _j : void 0,
      productName: (_l = (_k = departure.line) == null ? void 0 : _k.productName) != null ? _l : void 0,
      mode: (_n = (_m = departure.line) == null ? void 0 : _m.mode) != null ? _n : void 0,
      operator: (_q = (_p = (_o = departure.line) == null ? void 0 : _o.operator) == null ? void 0 : _p.name) != null ? _q : void 0
    },
    remarks: groupRemarksByType((_r = departure.remarks) != null ? _r : []),
    stopinfo: {
      name: (_t = (_s = departure.stop) == null ? void 0 : _s.name) != null ? _t : void 0,
      id: (_v = (_u = departure.stop) == null ? void 0 : _u.id) != null ? _v : void 0,
      type: (_x = (_w = departure.stop) == null ? void 0 : _w.type) != null ? _x : void 0,
      location: ((_y = departure.stop) == null ? void 0 : _y.location) ? {
        latitude: (_z = departure.stop.location.latitude) != null ? _z : void 0,
        longitude: (_A = departure.stop.location.longitude) != null ? _A : void 0
      } : void 0
    }
  };
}
function mapDeparturesToDepartureStates(departures) {
  return departures.map(mapDepartureToDepartureState);
}
function mapDeparturesResponseToStates(response) {
  return mapDeparturesToDepartureStates(response.departures);
}
function mapStationToStationState(station) {
  return {
    name: station.name,
    id: station.id,
    type: station.type,
    location: station.location ? {
      latitude: station.location.latitude,
      longitude: station.location.longitude
    } : void 0
  };
}
function mapJourneyToJourneyState(journey) {
  var _a, _b;
  return {
    legs: (_b = (_a = journey.journeys) == null ? void 0 : _a.flatMap(
      (j) => {
        var _a2, _b2;
        return (_b2 = (_a2 = j.legs) == null ? void 0 : _a2.map((leg) => {
          var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K;
          return {
            stationFrom: {
              id: (_b3 = (_a3 = leg.origin) == null ? void 0 : _a3.id) != null ? _b3 : void 0,
              name: (_d = (_c = leg.origin) == null ? void 0 : _c.name) != null ? _d : void 0,
              type: (_f = (_e = leg.origin) == null ? void 0 : _e.type) != null ? _f : void 0,
              location: ((_g = leg.origin) == null ? void 0 : _g.type) === "station" || ((_h = leg.origin) == null ? void 0 : _h.type) === "stop" ? leg.origin.location ? {
                latitude: (_i = leg.origin.location.latitude) != null ? _i : void 0,
                longitude: (_j = leg.origin.location.longitude) != null ? _j : void 0
              } : void 0 : void 0
            },
            stationTo: {
              id: (_l = (_k = leg.destination) == null ? void 0 : _k.id) != null ? _l : void 0,
              name: (_n = (_m = leg.destination) == null ? void 0 : _m.name) != null ? _n : void 0,
              type: (_p = (_o = leg.destination) == null ? void 0 : _o.type) != null ? _p : void 0,
              location: ((_q = leg.destination) == null ? void 0 : _q.type) === "station" || ((_r = leg.destination) == null ? void 0 : _r.type) === "stop" ? leg.destination.location ? {
                latitude: (_s = leg.destination.location.latitude) != null ? _s : void 0,
                longitude: (_t = leg.destination.location.longitude) != null ? _t : void 0
              } : void 0 : void 0
            },
            departure: (_u = leg.departure) != null ? _u : void 0,
            plannedDeparture: (_v = leg.plannedDeparture) != null ? _v : void 0,
            departureDelay: (_w = leg.departureDelay) != null ? _w : void 0,
            arrival: (_x = leg.arrival) != null ? _x : void 0,
            plannedArrival: (_y = leg.plannedArrival) != null ? _y : void 0,
            arrivalDelay: (_z = leg.arrivalDelay) != null ? _z : void 0,
            line: leg.line ? {
              name: (_A = leg.line.name) != null ? _A : void 0,
              fahrtNr: (_B = leg.line.fahrtNr) != null ? _B : void 0,
              productName: (_C = leg.line.productName) != null ? _C : void 0,
              mode: (_D = leg.line.mode) != null ? _D : void 0,
              operator: (_F = (_E = leg.line.operator) == null ? void 0 : _E.name) != null ? _F : void 0
            } : void 0,
            direction: (_G = leg.direction) != null ? _G : void 0,
            arrivalPlatform: (_H = leg.arrivalPlatform) != null ? _H : void 0,
            plannedArrivalPlatform: (_I = leg.plannedArrivalPlatform) != null ? _I : void 0,
            departurePlatform: (_J = leg.departurePlatform) != null ? _J : void 0,
            plannedDeparturePlatform: (_K = leg.plannedDeparturePlatform) != null ? _K : void 0,
            remarks: leg.remarks ? groupRemarksByType(leg.remarks) : void 0
          };
        })) != null ? _b2 : [];
      }
    )) != null ? _b : void 0
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mapDepartureToDepartureState,
  mapDeparturesResponseToStates,
  mapDeparturesToDepartureStates,
  mapJourneyToJourneyState,
  mapStationToStationState
});
//# sourceMappingURL=mapper.js.map

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
var depReq_exports = {};
__export(depReq_exports, {
  DepartureRequest: () => DepartureRequest
});
module.exports = __toCommonJS(depReq_exports);
var import_definition = require("../const/definition");
var import_library = require("../tools/library");
var import_mapper = require("../tools/mapper");
var import_types = require("../types/types");
class DepartureRequest extends import_library.BaseClass {
  response;
  constructor(adapter) {
    super(adapter);
    this.response = {};
  }
  /**
   *  Ruft Abfahrten für eine gegebene stationId ab und schreibt sie in die States.
   *
   * @param stationId     Die ID der Station, für die Abfahrten abgefragt werden sollen.
   * @param options      Zusätzliche Optionen für die Abfrage.
   */
  async getDepartures(stationId, options = {}) {
    try {
      if (!stationId) {
        throw new Error("Keine stationId \xFCbergeben");
      }
      const hService = this.adapter.hService;
      const mergedOptions = { ...import_types.defaultDepartureOpt, ...options };
      this.response = await hService.getDepartures(stationId, mergedOptions);
      this.adapter.log.info(JSON.stringify(this.response.departures, null, 1));
      await this.library.writedp(`${this.adapter.namespace}.${stationId}`, void 0, import_definition.defaultFolder);
      const departureStates = (0, import_mapper.mapDeparturesToDepartureStates)(this.response.departures);
      await this.library.cleanUpTree([`${this.adapter.namespace}.${stationId}`], null, 1);
      await this.library.writeFromJson(
        `${this.adapter.namespace}.${stationId}.`,
        "departures",
        import_definition.genericStateObjects,
        departureStates,
        true
      );
    } catch (error) {
      this.log.error(`Fehler bei der Abfrage der Abfahrten: ${error.message}`);
      throw error;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DepartureRequest
});
//# sourceMappingURL=depReq.js.map

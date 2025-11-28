import * as utils from '@iobroker/adapter-core';
import type { DepartureRequest } from '../class/depReq';
import type { HafasService } from '../hafasService';
import type { Library } from '../tools/library';

declare class TTAdapter extends utils.Adapter {
    library: Library;
    hService: HafasService;
    depRequest: DepartureRequest;
    getHafasService(): HafasService;
    unload: boolean;
}

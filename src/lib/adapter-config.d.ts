// This file extends the AdapterConfig type from "@types/iobroker"

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
	namespace ioBroker {
		interface AdapterConfig {
			hafasProfile?: string;
			clientName?: string;
			logUnknownTokens?: boolean;
			stationId?: string;
			stationName?: string;
		}
	}
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export { };


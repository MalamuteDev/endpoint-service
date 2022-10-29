import { EndpointServiceOverrideConfig } from './endpoint-service-override.config';

export interface EndpointServiceConfig {
    baseUrl: string;
    port?: number;
    prefix?: string;
    timeout?: number;
    endpoints: { [key: string]: string | EndpointServiceOverrideConfig };
}

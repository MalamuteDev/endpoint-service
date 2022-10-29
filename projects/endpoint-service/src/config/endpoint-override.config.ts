import { EndpointInfoEnum } from '../models/endpoint-info.enum';

export interface EndpointOverrideConfig {
    baseUrl: string;
    port?: number | EndpointInfoEnum;
    prefix?: string | EndpointInfoEnum;
    timeout?: number | EndpointInfoEnum;
}

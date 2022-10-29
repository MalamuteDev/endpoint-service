import { EndpointOverrideConfig } from './endpoint-override.config';

export interface EndpointServiceOverrideConfig {
    url: string;
    override?: Partial<EndpointOverrideConfig>;
}

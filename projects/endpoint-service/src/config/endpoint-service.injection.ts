import { InjectionToken } from '@angular/core';
import { EndpointServiceConfig } from './endpoint-service.config';

export const SERVICE_ENDPOINT_INJECTION_TOKEN =
    new InjectionToken<EndpointServiceConfig>(
        'SERVICE_ENDPOINT_INJECTION_TOKEN'
    );

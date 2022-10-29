import { TestBed } from '@angular/core/testing';

import { EndpointService } from './endpoint.service';
import { Meta } from '@angular/platform-browser';
import {
    EndpointServiceConfig,
    SERVICE_ENDPOINT_INJECTION_TOKEN,
} from '../config';

describe('EndpointServiceService', () => {
    let service: EndpointService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: Meta },
                {
                    provide: SERVICE_ENDPOINT_INJECTION_TOKEN,
                    useValue: {
                        baseUrl: 'baseUrl',
                        port: 123,
                        prefix: 'prefix',
                        timeout: 5,
                        endpoints: {
                            A: '123',
                        },
                    } as EndpointServiceConfig,
                },
                EndpointService,
            ],
        });
        service = TestBed.inject(EndpointService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

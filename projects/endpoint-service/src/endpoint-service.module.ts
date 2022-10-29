import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    EndpointServiceConfig,
    SERVICE_ENDPOINT_INJECTION_TOKEN,
} from './config';
import { EndpointService } from './service';

@NgModule({
    declarations: [],
    imports: [CommonModule],
    providers: [EndpointService],
})
export class EndpointServiceModule {
    static forRoot(
        config: EndpointServiceConfig
    ): ModuleWithProviders<EndpointServiceModule> {
        return {
            ngModule: EndpointServiceModule,
            providers: [
                {
                    provide: SERVICE_ENDPOINT_INJECTION_TOKEN,
                    useValue: config,
                },
            ],
        };
    }
}

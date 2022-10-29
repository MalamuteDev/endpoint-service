import { Inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import {
    EndpointModel,
    EndpointInfoEnum,
    EndpointServiceModel,
    EndpointDetailsModel,
} from '../models';
import {
    BASE_URL_META_TAG_NAME,
    EndpointServiceConfig,
    EndpointServiceOverrideConfig,
    SERVICE_ENDPOINT_INJECTION_TOKEN,
} from '../config';
import { Meta } from '@angular/platform-browser';
import { EndpointUtils } from '../utils';

@Injectable()
export class EndpointService {
    constructor(
        @Inject(SERVICE_ENDPOINT_INJECTION_TOKEN)
        protected endpointConfig: EndpointServiceConfig,
        protected meta: Meta
    ) {}

    getEndpoint(
        endpointServiceModel: EndpointServiceModel
    ): Observable<EndpointDetailsModel> {
        if (
            !endpointServiceModel ||
            !endpointServiceModel.name ||
            !this.endpointConfig ||
            !this.endpointConfig.endpoints
        ) {
            throw throwError(
                () => new Error('Invalid Endpoint Service Config')
            );
        }

        const endpoint: EndpointModel | undefined = this.createEndpointModel(
            endpointServiceModel.name
        );
        if (!endpoint || !endpoint.baseUrl || !endpoint.url) {
            throw throwError(
                () =>
                    new Error(
                        `Invalid Endpoint Service Config for key: ${endpointServiceModel.name}`
                    )
            );
        }

        const baseUrlMetaTagContent = this.getBaseUrlMetaTagConfig();
        const baseUrl = baseUrlMetaTagContent || endpoint.baseUrl;

        const urlPart = this.replacePathVariables(
            endpointServiceModel,
            endpoint.url
        );

        const port =
            baseUrlMetaTagContent || !endpoint.port ? '' : `:${endpoint.port}`;

        const prefix = endpoint.prefix
            ? this.setOrIgnoreSlash(endpoint.prefix)
            : ``;

        const queryParameters = this.getQueryParameters(endpointServiceModel);

        return of({
            url: `${baseUrl}${port}${prefix}${urlPart}${queryParameters}`,
            endpointInfo: {
                baseUrl,
                port,
                prefix,
                timeout: endpoint.timeout,
            },
        });
    }

    private getBaseUrlMetaTagConfig() {
        return EndpointUtils.getMetaTagContent(
            BASE_URL_META_TAG_NAME,
            this.meta
        );
    }

    getRawUrl(): string {
        if (!this.endpointConfig || !this.endpointConfig.baseUrl) {
            throw throwError(
                () =>
                    new Error(
                        'Invalid Endpoint Service Config, define a base url'
                    )
            );
        }

        const baseUrl = this.getBaseUrlMetaTagConfig();
        if (baseUrl) {
            return baseUrl;
        }

        return this.endpointConfig.port
            ? `${this.endpointConfig.baseUrl}:${this.endpointConfig.port}`
            : this.endpointConfig.baseUrl;
    }

    private createEndpointModel(
        endpointName: string
    ): EndpointModel | undefined {
        const endpointConfig: string | EndpointServiceOverrideConfig =
            this.endpointConfig.endpoints[endpointName];
        if (!endpointConfig) {
            return undefined;
        }
        if (typeof endpointConfig === 'string') {
            return {
                baseUrl: this.endpointConfig.baseUrl,
                port: this.endpointConfig.port,
                prefix: this.endpointConfig.prefix,
                timeout: this.endpointConfig.timeout,
                url: endpointConfig,
            };
        }

        if (!endpointConfig.url) {
            return undefined;
        }

        const endpointOverrideConfig = endpointConfig.override;
        if (!endpointOverrideConfig) {
            return {
                baseUrl: this.endpointConfig.baseUrl,
                port: this.endpointConfig.port,
                prefix: this.endpointConfig.prefix,
                timeout: this.endpointConfig.timeout,
                url: endpointConfig.url,
            };
        }

        const baseUrl: string = endpointOverrideConfig.baseUrl
            ? endpointOverrideConfig.baseUrl
            : this.endpointConfig.baseUrl;

        const port: number | undefined = this.getOrUndefined(
            endpointOverrideConfig.port,
            this.endpointConfig.port
        );

        const prefix: string | undefined = this.getOrUndefined(
            endpointOverrideConfig.prefix,
            this.endpointConfig.prefix
        );

        const timeout: number | undefined = this.getOrUndefined(
            endpointOverrideConfig.timeout,
            this.endpointConfig.timeout
        );

        const url = endpointConfig.url;

        return {
            baseUrl,
            port,
            prefix,
            url,
            timeout,
        };
    }

    private replacePathVariables(
        endpointServiceModel: EndpointServiceModel,
        endpointUrl: string
    ): string {
        let url = endpointUrl;
        const pathVariables = endpointServiceModel.pathVariables;
        if (pathVariables && pathVariables.size > 0) {
            pathVariables.forEach((value: string, key: string) => {
                const searchKey = '${' + key + '}';
                url = url.replace(searchKey, value);
            });
        }
        return this.setOrIgnoreSlash(url);
    }

    private setOrIgnoreSlash(url: string) {
        return url.startsWith('/') ? url : `/${url}`;
    }

    private getQueryParameters(
        endpointServiceModel: EndpointServiceModel
    ): string {
        const queryParams = endpointServiceModel.queryParams;
        return queryParams && queryParams.size > 0
            ? `?${Array.from(queryParams)
                  .map(([paramKey, paramValue]) =>
                      this.getQueryParameter(paramKey, paramValue)
                  )
                  .join('&')}`
            : '';
    }

    private getQueryParameter(paramKey: string, paramValue: string | string[]) {
        return Array.isArray(paramValue)
            ? paramValue.map(value => `${paramKey}=${value}`).join('&')
            : `${paramKey}=${paramValue}`;
    }

    private getOrUndefined<T>(
        highPriorityProperty: T | EndpointInfoEnum,
        defaultValue: T
    ): T | undefined {
        if (highPriorityProperty === EndpointInfoEnum.REMOVE) {
            return undefined;
        }
        return highPriorityProperty ? highPriorityProperty : defaultValue;
    }
}

export interface EndpointServiceModel {
    name: string;
    pathVariables?: Map<string, string>;
    queryParams?: Map<string, string | string[]>;
}

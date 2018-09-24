import { Response, Request } from 'apollo-server-env';
import { CacheOptions, RequestOptions } from 'apollo-datasource-rest/dist/RESTDataSource';
import { IMiddleware } from 'koa-router';
import { RequestInit } from 'apollo-server-env';

export interface FetchUrlResult {
  id: string | number;
  type: string;
  path: string;
}
export interface ConfigurableConstructorParams<T = object> {
  config?: T;
  name?: string;
}

export type ContextType = {
  isAuthRequired?: boolean;
  [propName: string]: any;
};

export interface ApiDataSourceConfig {
  host?: string;
  port?: number;
  protocol?: string;
  fetchUrlPriority?: number;
  [propName: string]: any;
}

// todo: this is a temporary type just to have proper type checking in the Extension class. It needs to be improved.
export type ExtensionContainer = object;

export interface ContextData {
  context?: ContextType;
}

export type ContextRequestInit = RequestInit & ContextData;

export type ContextCacheOptions = CacheOptions & ContextData;

export type ContextRequestOptions = RequestOptions & ContextData;

export type ContextFetchOptions = {
  cacheKey?: string;
  cacheOptions?:
    | ContextCacheOptions
    | ((response: Response, request: Request) => ContextCacheOptions | undefined)
};

export type ContextFetchResponse = Response & ContextData;

export interface ApiDataSourceEndpoint {
  path: string;
  methods: string[];
  handler: IMiddleware
}

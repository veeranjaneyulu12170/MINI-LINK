declare module 'axios' {
  export interface AxiosRequestConfig {
    // Basic axios request config properties
    url?: string;
    method?: string;
    baseURL?: string;
    headers?: any;
    params?: any;
    data?: any;
    timeout?: number;
    withCredentials?: boolean;
    // Add other properties as needed
  }

  export interface AxiosResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: AxiosRequestConfig;
    request?: any;
  }

  export interface AxiosError<T = any> extends Error {
    config: AxiosRequestConfig;
    code?: string;
    request?: any;
    response?: AxiosResponse<T>;
    isAxiosError: boolean;
    toJSON: () => object;
  }

  export interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<AxiosResponse>;
    (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse>;
    defaults: AxiosRequestConfig;
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    // Add other methods as needed
  }

  export function create(config?: AxiosRequestConfig): AxiosInstance;
  export function isCancel(value: any): boolean;
  export function all<T>(values: (T | Promise<T>)[]): Promise<T[]>;
  export function spread<T, R>(callback: (...args: T[]) => R): (array: T[]) => R;

  const axios: AxiosInstance & {
    create: typeof create;
    isCancel: typeof isCancel;
    all: typeof all;
    spread: typeof spread;
  };

  export default axios;
} 
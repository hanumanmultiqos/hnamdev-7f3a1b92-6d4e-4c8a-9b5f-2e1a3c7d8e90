import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  catchError,
  retry,
  throwError,
  firstValueFrom,
  timeout,
  TimeoutError,
  Observable,
} from 'rxjs';
import url from '../../../../public/config/config.json';
import { HeaderService } from './header.service';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrls: string[] = url.apiUrls?.BASE_URL
    ? [url.apiUrls.BASE_URL]
    : [];

  private currentUrlIndex = 0;
  private appConfig: any;

  private readonly _header = inject(HeaderService);
  private readonly _helper = inject(HelperService);
  private readonly _http = inject(HttpClient);

  /**
   * Load configuration dynamically (optional if using static config import)
   */
  async loadAppConfig(): Promise<void> {
    try {
      const data: any = await firstValueFrom(
        this._http.get('assets/data/config.json'),
      );

      this.appConfig = data;
      this.apiUrls = this.appConfig.apiUrls || this.apiUrls;
    } catch (error) {
      console.error('Error loading config:', error);
    }
  }

  /**
   * Build full API URL
   */
  private apiUrl(baseUrl: string, endpoint: string): string {
    return `${baseUrl}${endpoint}`;
  }

  /**
   * Rotate to next API URL (failover)
   */
  private getNextUrl(): string {
    if (!this.apiUrls.length) {
      throw new Error('No API URLs configured');
    }

    this.currentUrlIndex = (this.currentUrlIndex + 1) % this.apiUrls.length;

    return this.apiUrls[this.currentUrlIndex];
  }

  /**
   * Core failover logic
   */
  private requestWithFailover<T>(
    requestFn: (url: string) => Observable<any>,
    timeoutMs = 60000,
  ): Observable<T> {
    const attempt = (urlIndex: number): Observable<T> => {
      const baseUrl = this.apiUrls[urlIndex];

      return requestFn(baseUrl).pipe(
        timeout(timeoutMs),
        catchError((error) => {
          if (error instanceof TimeoutError) {
            console.warn(`Timeout at ${baseUrl}`);
          }

          const nextIndex = urlIndex + 1;

          if (nextIndex >= this.apiUrls.length) {
            return throwError(() => error);
          }

          console.warn('Switching to backup API...');
          return attempt(nextIndex);
        }),
      );
    };

    return attempt(this.currentUrlIndex).pipe(
      retry({
        count: this.apiUrls.length - 1,
        delay: 1000,
        resetOnSuccess: true,
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  /**
   * Generic HTTP method handler
   */
  private makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    body?: any,
    options?: any,
  ): Observable<any> {
    return this.requestWithFailover<T>((url: any) => {
      const fullUrl = this.apiUrl(url, endpoint);
      const requestOptions = {
        ...this._header.getHeader(),
        ...options,
      };

      switch (method) {
        case 'GET': {
          const requestOptions = {
            ...this._header.getHeader(),
            ...(options?.params
              ? { params: options.params }
              : options
                ? { params: options }
                : {}),
          };
          return this._http.get<T>(fullUrl, requestOptions);
        }

        case 'POST':
          return this._http.post<T>(fullUrl, body, requestOptions);

        case 'PUT':
          return this._http.put<T>(fullUrl, body, requestOptions);

        case 'PATCH':
          return this._http.patch<T>(fullUrl, body, requestOptions);

        case 'DELETE':
          return this._http.delete<T>(fullUrl, requestOptions);

        default:
          throw new Error('Unsupported HTTP method');
      }
    }).pipe(catchError((error) => this._helper.handleAuthError(error)));
  }

  get<T>(endpoint: string, options?: any): Observable<T> {
    console.log(this.makeRequest<T>('GET', endpoint, null, options));

    return this.makeRequest<T>('GET', endpoint, null, options);
  }

  post<T>(endpoint: string, body: any, options?: any): Observable<T> {
    return this.makeRequest<T>('POST', endpoint, body, options);
  }

  put<T>(endpoint: string, body: any, options?: any): Observable<T> {
    return this.makeRequest<T>('PUT', endpoint, body, options);
  }

  patch<T>(endpoint: string, body: any, options?: any): Observable<T> {
    return this.makeRequest<T>('PATCH', endpoint, body, options);
  }

  delete<T>(endpoint: string, options?: any): Observable<T> {
    return this.makeRequest<T>('DELETE', endpoint, null, options);
  }
}

import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiSuccessResponse } from "../models/api.models";
import { API_BASE_URL } from "./api-base-url.token";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  protected get<T>(path: string): Observable<ApiSuccessResponse<T>> {
    return this.http.get<ApiSuccessResponse<T>>(this.buildUrl(path));
  }

  protected getWithQuery<T>(
    path: string,
    query: Record<string, string | number | boolean | undefined>
  ): Observable<ApiSuccessResponse<T>> {
    let params = new HttpParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        return;
      }

      params = params.set(key, String(value));
    });

    return this.http.get<ApiSuccessResponse<T>>(this.buildUrl(path), {
      params
    });
  }

  protected post<TResponse, TBody>(
    path: string,
    body: TBody
  ): Observable<ApiSuccessResponse<TResponse>> {
    return this.http.post<ApiSuccessResponse<TResponse>>(this.buildUrl(path), body);
  }

  protected patch<TResponse, TBody>(
    path: string,
    body: TBody
  ): Observable<ApiSuccessResponse<TResponse>> {
    return this.http.patch<ApiSuccessResponse<TResponse>>(
      this.buildUrl(path),
      body
    );
  }

  protected put<TResponse, TBody>(
    path: string,
    body: TBody
  ): Observable<ApiSuccessResponse<TResponse>> {
    return this.http.put<ApiSuccessResponse<TResponse>>(this.buildUrl(path), body);
  }

  protected delete<TResponse>(
    path: string
  ): Observable<ApiSuccessResponse<TResponse>> {
    return this.http.delete<ApiSuccessResponse<TResponse>>(this.buildUrl(path));
  }

  private buildUrl(path: string): string {
    return `${this.apiBaseUrl}${path}`;
  }
}

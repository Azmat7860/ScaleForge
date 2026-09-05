import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from "@angular/core";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling
} from "@angular/router";
import { API_BASE_URL } from "./core/services/api-base-url.token";
import { authInterceptor } from "./core/interceptors/auth.interceptor";
import { errorInterceptor } from "./core/interceptors/error.interceptor";
import { routes } from "./app.routes";

const apiBaseUrl = `http://${globalThis.location.hostname || "localhost"}:5000/api/v1`;

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        scrollPositionRestoration: "enabled"
      })
    ),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    {
      provide: API_BASE_URL,
      useValue: apiBaseUrl
    }
  ]
};

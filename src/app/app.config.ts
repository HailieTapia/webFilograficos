import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { errorHandlerInterceptor } from './components/services/error-handler.service'; // Importa la función interceptor

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([errorHandlerInterceptor])), // Usa la función interceptor en lugar de la clase
    provideRouter(routes),
  ]
};

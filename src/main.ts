import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http'; // Asegúrate de importar esto
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes'; // Asegúrate de tener tus rutas definidas

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    provideHttpClient(withFetch()), // Asegúrate de incluir esto
    provideRouter(routes), // Proveer el enrutador aquí
    provideAnimations(), // Proveer las animaciones aquí
  ],
}).catch((err) => console.error(err));

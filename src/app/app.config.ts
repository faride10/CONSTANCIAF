import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router'; 
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AlumnoService } from './layout/alumno.service'; 
import { ConferenceService } from './layout/conference.service'; 
import { DashboardService } from './layout/dashboard.service';
import { DocenteService } from './layout/docente.service';
import { GrupoService } from './layout/grupo.service';
import { PonenteService } from './layout/ponente.service';

import { TokenInterceptor } from './layout/token.interceptor'; 
import { routes } from './app.routes'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    
    provideHttpClient(withInterceptorsFromDi()), 

    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true, 
    },

    provideAnimations(), 
    
    AlumnoService,
    ConferenceService,
    DashboardService,
    DocenteService,
    GrupoService,
    PonenteService,
  ]
};
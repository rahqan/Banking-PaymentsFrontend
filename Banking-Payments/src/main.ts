// // import { bootstrapApplication } from '@angular/platform-browser';
// //    import { appConfig } from './app/app.config';
// //    import { AppComponent } from './app/app.component';

// //    bootstrapApplication(AppComponent, appConfig)
// //      .catch((err) => console.error(err));


//      // src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/interceptors/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      NgChartsModule
    ),
    provideHttpClient(
      withInterceptors([authInterceptor])  // ← Add this!
    ),
    provideRouter(routes)
  ]
});


// app.config.ts (for standalone applications)
// import { ApplicationConfig } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { routes } from './app/app.routes';
// import { authInterceptor } from './app/interceptors/auth.interceptor';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter(routes),
//     provideHttpClient(
//       withInterceptors([authInterceptor])  // ← Add this!
//     )
//   ]
// };
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { appConfig } from './app/app.config';
import { App } from './app/app';

appConfig.providers = [
  ...(appConfig.providers || []),
  provideHttpClient(withFetch())   // <-- enable fetch for HttpClient
];

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

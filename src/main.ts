import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';

// export const apiEndPoint: string = 'http://127.0.0.1:8851'
export const apiEndPoint: string = 'https://dogshit.ngrok.app/' + "openroboticsteam"

export function formatDateToMMDDYYYY(date: Date): string {
  date = new Date(date);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const month = months[date.getMonth()]; // getMonth() returns 0-based month
  const day = date.getDate().toString();
  const year = date.getFullYear().toString();

  return `${month} ${day}, ${year}`;
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

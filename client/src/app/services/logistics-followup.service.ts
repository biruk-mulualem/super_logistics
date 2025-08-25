import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogisticsFollowupService {

  private apiUrl = 'http://localhost:5000/api/logisticsfollowups'; // Base API URL

  constructor(private http: HttpClient) { }

  // --- GET all logistics rows (filtered) ---
getIntransitDataForLogistics(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/IntransitData`).pipe(
    tap((response) => {
      console.log('Received intransit data:', JSON.stringify(response, null, 2)); // Pretty print the response
    })
  );
}


}

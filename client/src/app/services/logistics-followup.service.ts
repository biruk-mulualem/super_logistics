import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogisticsFollowupService {

  private apiUrl = 'http://localhost:5000/api/logisticsfollowups'; // Base API URL

  constructor(private http: HttpClient) { }

  // Add a new logistics entry
  addLogistics(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/AddLogistics`, data).pipe(
      tap((response) => {
        console.log('Logistics added successfully:', response);
      })
    );
  }

  // Get intransit data for dropdowns or selection
  getIntransitDataForLogistics(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/IntransitData`)
  }


getLogisticsData(transactionId: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/LogisticsData`)
}

}

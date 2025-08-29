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


getLogisticsData(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/LogisticsData`)
}

// Update main followup + items
updateLogisticsDetailData(id: number, data: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/logisticsDetail/${id}`, data);
}

// Update main followup + items


// logistics.service.ts
// updateDeletedLogisticsData(id: number): Observable<any> {
//   return this.http.delete(`${this.apiUrl}/logisticsDeleteDetail/${id}`, {});
// }



  deleteIntransitData(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/logisticsDeleteDetail/${id}`);
  }


}

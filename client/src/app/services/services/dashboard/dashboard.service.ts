import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class DashboardService {
  // Base API URL
  private apiUrl = 'http://localhost:5000/api/Dashboards';
  //  private apiUrl = '/api/Dashboards';
  constructor(private http: HttpClient) { }

  getIntransitRelatedData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/IntransitRelateddata`)  
  }

getLogisticsRelatedData(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/IogisticsRelateddata`)
   
}

getReminderAndAlertsData(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/ReminderAndAlerts`)
   
}





}

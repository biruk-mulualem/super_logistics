import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogisticsFollowupService {

  private apiUrl = 'http://localhost:5000/api/logisticsfollowups'; // Base API URL

  constructor(private http: HttpClient) { }

  // --- GET all logistics rows (filtered) ---
  getLogisticsData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/logistics`);
  }

  // --- GET single logistics row by id ---
  getLogisticsDataById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // --- PUT / update a logistics row by id ---
  updateLogisticsData(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // --- DELETE a logistics row by id ---
  deleteLogisticsData(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

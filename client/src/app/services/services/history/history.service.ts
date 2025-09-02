
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private apiUrl = 'http://localhost:5000/api/logisticsfollowups'; // Base API URL

  constructor(private http: HttpClient) { }

  // --- GET all logistics rows (filtered) ---
  getHistoryData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history`);
  }

  // --- GET single logistics row by id ---
  getHistoryDataById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // --- POST a new logistics row ---
  createHistoryData(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, data);
  }

  // --- PUT / update a logistics row by id ---
  updateHistoryData(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // --- DELETE a logistics row by id ---
  deleteHistoryData(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

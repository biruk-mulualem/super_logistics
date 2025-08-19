import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators'; // <-- import these

@Injectable({
  providedIn: 'root'
})
export class IntransitFollowupService {
    private apiUrl = 'http://localhost:5000/api/IntransitFollowups'; // Base API URL

  constructor(private http: HttpClient) { }

  // --- GET all Intransit rows (filtered) ---
  getIntransitData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
    // --- POST a new Intransit row ---
createIntransitData(data: any): Observable<any> {  
  console.log('Fetching Intransit data from API:', this.apiUrl);
  return this.http.post<any>(`${this.apiUrl}`, data);
}
  // --- GET single Intransit row by id ---
  getIntransitDataById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // --- PUT / update a Intransit row by id ---
  updateIntransitData(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // --- DELETE a Intransit row by id ---
  deleteIntransitData(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

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
  return this.http.get<any[]>(`${this.apiUrl}`).pipe(
    map(followups => {
      // Find the maximum numeric part from existing TransactionIds
      let maxNumber = 0;
      followups.forEach(f => {
        const num = parseInt(f.TransactionId?.substring(3) ?? '0', 10);
        if (num > maxNumber) maxNumber = num;
      });

      // Generate next TransactionId
      data.TransactionId = `SDT${(maxNumber + 1).toString().padStart(6, '0')}`;
      return data;
    }),
    switchMap(newData => this.http.post<any>(`${this.apiUrl}`, newData))
  );
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

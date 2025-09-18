import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class IntransitFollowupService {
  addLogistics(): Observable<unknown> {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:5000/api/IntransitFollowups'; // Base API URL
  // private apiUrl = '/api/IntransitFollowups'; // Base API URL
  constructor(private http: HttpClient) {}

  // --- GET all Intransit rows by status ---done
  getIntransitStatus0Data(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/status0`);
  }

  getIntransitStatus1Data(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/status1`);
  }

  getIntransitData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/statusOther`);
  }

  // --- GET item details for a followup by transactionId ---
  getIntransitItemsDetailStatus0Data(transactionId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/status0/${transactionId}`);
  }

  getIntransitItemsDetailStatus1Data(transactionId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/status1/${transactionId}`);
  }

  getIntransitItemsDetailData(transactionId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/statusOther/${transactionId}`);
  }

  // --- GET payment history for a transaction ---
  getPaymentData(transactionId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/payment/${transactionId}`);
  }

  // --- POST a new Intransit followup ---
  createIntransitData(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/intransit`, data);
  }

  // --- POST payment terms ---
  createPaymentTerms(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/payment`, data);
  }

  // --- GET single followup by id ---
  getIntransitDataById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

// Update main followup + items
updateIntransitData(id: number, data: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/intransit/${id}`, data);
}

// Update payment table (and trigger recalculation on the backend)
updatePaymentData(id: number, data: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/payment/${id}`, data);
}

  // --- DELETE a followup by id ---
  deleteIntransitData(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

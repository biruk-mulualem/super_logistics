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
  // =======================================================
  // GET all payment data rows (filtered)
  // =======================================================
  getPaymentData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/payment`)
      // .pipe(
      //   tap((data: any) => console.log('[DEBUG] Payment Data:', data))
      // );
  }

  // ✅ new method with correct typing
getInRouteDjbAakSdtData(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/InRouteDjbAakSdt`)
    // .pipe(tap(data => console.log('[DEBUG] InRoute Stats:', data)));
}



}

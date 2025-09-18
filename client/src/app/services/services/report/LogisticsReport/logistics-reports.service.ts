import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogisticsReportsService {
   private apiUrl = 'http://localhost:5000/api/LogisticsReport';
    //  private apiUrl = '/api/LogisticsReport';
  constructor(private http: HttpClient) {}
  GetReportData(filters: any): Observable<any> {
    // Convert filters object into HttpParams
    let params = new HttpParams();
    for (const key in filters) {
      if (filters.hasOwnProperty(key)) {
        params = params.set(key, filters[key]);
      }
    }

    return this.http.get<any>(this.apiUrl, { params });
  }
}

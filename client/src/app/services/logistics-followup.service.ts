import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogisticsFollowupService {

  private apiUrl = 'http://localhost:5000/api/logisticsfollowups'; // Your API URL

  constructor(private http: HttpClient) { }

  getFollowups(): Observable<any[]> { // fetch all
    return this.http.get<any[]>(this.apiUrl);
  }

  getFollowupById(id: number): Observable<any> { // fetch one by id
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createFollowup(data: any): Observable<any> { // add new
    return this.http.post<any>(this.apiUrl, data);
  }

  updateFollowup(id: number, data: any): Observable<any> { // update existing
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteFollowup(id: number): Observable<any> { // delete
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

}

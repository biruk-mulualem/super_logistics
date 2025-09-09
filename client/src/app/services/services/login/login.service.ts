import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  // Base API URL
  private apiUrl = 'http://localhost:5000/api/Users';
  constructor(private http: HttpClient) {}

  // --- POST a new login data ---
  PostLoginData(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, data);
  }
}

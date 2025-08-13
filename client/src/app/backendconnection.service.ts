import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Service available app-wide
})
export class BackendconnectionService {
  private apiUrl = 'https://localhost:5001/api'; // Your ASP.NET Core backend URL

  constructor(private http: HttpClient) {}

  // Example method to get data from /api/products endpoint
  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`);
  }
}

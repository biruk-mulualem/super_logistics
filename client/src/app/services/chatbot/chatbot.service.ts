import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ChatResponse {
  response: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  // private apiUrl = '/api/chat';  // Your backend endpoint
 private apiUrl = 'http://localhost:5000/api/chatbots'; // Base API URL

  constructor(private http: HttpClient) { }

  sendMessageToApi(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.apiUrl, { message });
  }
}

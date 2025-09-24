import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {User} from '../../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  saveAuthData(token: string, userId: number, firstname: any): void {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userId', userId.toString());
    localStorage.setItem('firstname', firstname);
  }
  getFirstName(){
    return localStorage.getItem("firstname");
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('firstname');
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId) : null;
  }

  getUsername(): string {
    const userId = this.getUserId();
    return this.http.get(`${this.apiUrl}/${userId}/username`).toString();
  }
}

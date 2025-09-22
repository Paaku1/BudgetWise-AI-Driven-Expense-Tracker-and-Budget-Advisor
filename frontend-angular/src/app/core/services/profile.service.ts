import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Profile} from '../../shared/models/profile';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:5000/api/profile';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // ✅ THIS METHOD WAS MISSING, ADD IT NOW
  createProfile(profileData: Profile): Observable<any> {
    const userId = this.authService.getUserId();
    // Assuming a backend endpoint like POST /profiles/{userId}
    return this.http.post<any>(`${this.apiUrl}/${userId}`, profileData);
  }

  // ✅ This method is for getting the profile details
  getProfile(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/username`);
  }

  // ✅ This method is for uploading the image
  uploadProfileImage(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${this.apiUrl}/${id}/upload`, formData);
  }

  // ✅ This method is for getting the image
  getProfileImage(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/image`, { responseType: 'blob' });
  }

}




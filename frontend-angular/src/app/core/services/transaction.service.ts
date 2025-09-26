import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Transaction} from '../../shared/models/transaction';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {


  constructor(private http: HttpClient,private authService: AuthService) {
  }

  private url = 'http://localhost:5000/transactions';

  addTransaction(userId: number, transaction: Transaction): Observable<any> {
    return this.http.post(`${this.url}/${userId}`, transaction);
  }

  getTransactions(userId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.url}/${userId}`);
  }

  editTransaction(id: number,  transaction: Transaction): Observable<any> {
    return this.http.put(`${this.url}/${id}`, transaction);
  }

  deleteTransaction(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }


  getCategories(): Observable<any> {
    const userId = this.authService.getUserId();
    return this.http.get(`${this.url}/${userId}/category`);
  }

  getFilteredTransactions(userId: number, filters: any): Observable<Transaction[]> {
    let params = new HttpParams().set('userId', userId.toString());

    if (filters.type) {
      params = params.set('type', filters.type);
    }
    if (filters.category) {
      params = params.set('category', filters.category);
    }
    if (filters.startDate) {
      params = params.set('startDate', filters.startDate);
    }
    if (filters.endDate) {
      params = params.set('endDate', filters.endDate);
    }

    return this.http.get<Transaction[]>(`${this.url}/filter`, { params });
  }


}

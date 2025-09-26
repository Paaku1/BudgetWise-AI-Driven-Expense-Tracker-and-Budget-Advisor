import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define interfaces for the data structures
export interface ExpenseSummary {
  totalSpendThisMonth: number;
  averageDailySpend: number;
  highestSpendingCategory: string;
}

export interface CategorySpending {
  category: string;
  totalAmount: number;
}

export interface IncomeSummary {
  totalIncomeThisMonth: number;
  highestIncomeCategory: string;
}

export interface SavingsSummary {
  totalSavedThisMonth: number;
  goalsMet: number;
  goalsInProgress: number;
}

export interface CashFlowSummary {
  monthlyIncome: number;
  totalExpenses: number;
  moneyLeftToSpend: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private apiUrl = 'http://localhost:5000/api/analysis';

  constructor(private http: HttpClient) { }

  getExpenseSummary(userId: number): Observable<ExpenseSummary> {
    return this.http.get<ExpenseSummary>(`${this.apiUrl}/expense-summary/${userId}`);
  }

  getExpenseByCategory(userId: number): Observable<CategorySpending[]> {
    return this.http.get<CategorySpending[]>(`${this.apiUrl}/expense-by-category/${userId}`);
  }

  getExpenseSummaryForCategory(userId: number, category: string): Observable<ExpenseSummary> {
    return this.http.get<ExpenseSummary>(`${this.apiUrl}/expense-summary-by-category/${userId}`, { params: { category } });
  }

  getIncomeSummary(userId: number): Observable<IncomeSummary> {
    return this.http.get<IncomeSummary>(`${this.apiUrl}/income-summary/${userId}`);
  }

  getIncomeByCategory(userId: number): Observable<CategorySpending[]> {
    return this.http.get<CategorySpending[]>(`${this.apiUrl}/income-by-category/${userId}`);
  }

  getSavingsSummary(userId: number): Observable<SavingsSummary> {
    return this.http.get<SavingsSummary>(`${this.apiUrl}/savings-summary/${userId}`);
  }

  getIncomeSummaryForCategory(userId: number, category: string): Observable<IncomeSummary> {
    return this.http.get<IncomeSummary>(`${this.apiUrl}/income-summary-by-category/${userId}`, { params: { category } });
  }

  getCashFlowSummary(userId: number): Observable<CashFlowSummary> {
    return this.http.get<CashFlowSummary>(`${this.apiUrl}/cash-flow/${userId}`);
  }
}

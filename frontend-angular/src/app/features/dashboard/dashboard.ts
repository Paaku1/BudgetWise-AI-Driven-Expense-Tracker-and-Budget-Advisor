import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { TransactionService } from '../../core/services/transaction.service';
import { TransactionListComponent } from '../transaction/transaction-list/transaction-list';
import { Transaction } from '../../shared/models/transaction';
import {UserProfile} from '../../shared/models/userProfile';
import {TransactionFormComponent} from '../transaction/transaction-form/transaction-form';
import { SavingGoalsComponent } from '../saving-goals/saving-goals';
import { BudgetTrackerComponent } from '../budget-tracker/budget-tracker';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, TransactionFormComponent, TransactionListComponent, SavingGoalsComponent, BudgetTrackerComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  userProfile: UserProfile | null = null;
  loading = true;

  isFormVisible = false;
  transactions: Transaction[] = [];
  prefilledCategory: string | null = null; // New property for the prefilled category

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if(userId) {
      this.fetchProfile(userId);
      this.fetchDailyTransactions(userId);
    }
  }

  fetchProfile(userId: number): void {
    this.profileService.getProfile(userId).subscribe({
      next: (data) => {
        this.userProfile = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
        this.loading = false;
      }
    });
  }

  fetchDailyTransactions(userId: number): void {
    this.transactionService.getTransactions(userId).subscribe({
      next: (data) => {
        this.transactions = data;
      },
      error: (err) => {
        console.error('Error fetching transactions:', err);
      }
    });
  }

  onAddTransaction(): void {
    this.isFormVisible = true;
    this.prefilledCategory = null;
  }

  onAddTransactionForCategory(category: string): void {
    this.isFormVisible = true;
    this.prefilledCategory = category;
  }

  onTransactionAdded(newTransaction: Transaction): void {
    this.isFormVisible = false;
    this.fetchDailyTransactions(this.authService.getUserId()!);
  }
}

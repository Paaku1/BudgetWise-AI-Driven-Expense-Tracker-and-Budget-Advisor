import {Component, OnInit, ViewChild} from '@angular/core';
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
  imports: [CommonModule, RouterModule, TransactionFormComponent, TransactionListComponent, SavingGoalsComponent, BudgetTrackerComponent, SavingGoalsComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('budgetTracker') budgetTracker!: BudgetTrackerComponent;
  @ViewChild('savingGoalsTracker') savingGoalsTracker!: SavingGoalsComponent; // ✅ Add ViewChild for savings goals

  userProfile: UserProfile | null = null;
  loading = true;

  isFormVisible = false;
  transactions: Transaction[] = [];
  prefilledCategory: string | null = null; // New property for the prefilled category
  firstname: string | null = "USER";

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if(userId) {
      this.firstname = this.authService.getFirstName();
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

  fetchAllData(userId: number): void {
    this.fetchDailyTransactions(userId);
    // We need to access the budget tracker component to call its fetch method
    // This will be handled by listening to events instead.
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

  // ... onAddTransaction, onAddTransactionForCategory remain the same

  onTransactionAdded(newTransaction: Transaction): void {
    this.isFormVisible = false;
    this.refreshAllData();
  }

  onAddTransaction(): void {
    this.isFormVisible = true;
    this.prefilledCategory = null;
  }

  onAddTransactionForCategory(category: string): void {
    this.isFormVisible = true;
    this.prefilledCategory = category;
  }

  // ✅ Add this method to handle all data refreshing
  // ✅ This method will now refresh both lists
  refreshAllData(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.fetchDailyTransactions(userId);
      this.budgetTracker.fetchBudgets();
      this.savingGoalsTracker.fetchGoals();// Call the public method on the child component
    }
  }
}

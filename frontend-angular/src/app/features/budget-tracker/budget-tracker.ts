import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import { CommonModule, CurrencyPipe, PercentPipe, DatePipe } from '@angular/common';
import { Budget } from '../../shared/models/budget';
import { BudgetService } from '../../core/services/budget.service';
import { AuthService } from '../../core/services/auth.service';
import { BudgetFormComponent } from './budget-form/budget-form';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-budget-tracker',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, PercentPipe, DatePipe, BudgetFormComponent, FormsModule],
  templateUrl: './budget-tracker.html',
  styleUrl: './budget-tracker.scss'
})
export class BudgetTrackerComponent implements OnInit {
  @Output() addTransactionForCategory = new EventEmitter<string>();
  @Output() budgetUpdated = new EventEmitter<void>();
  @Output() budgetDeleted = new EventEmitter<void>();

  budgets: Budget[] = [];
  isBudgetFormVisible = false;
  editingBudget: Budget | null = null;
  editData: Partial<Budget> = {};

  constructor(
    private budgetService: BudgetService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchBudgets();
  }

  fetchBudgets(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.budgetService.getBudgets(userId).subscribe(budgets => {
        this.budgets = budgets;
      });
    }
  }

  onAddBudget(): void {
    this.editingBudget = null;
    this.editData = {};
    this.isBudgetFormVisible = true;
  }

  onBudgetAdded(newBudget: Budget): void {
    this.isBudgetFormVisible = false;
    this.fetchBudgets();
  }

  onAddTransaction(category: string): void {
    this.addTransactionForCategory.emit(category);
  }

  handleEdit(budget: Budget): void {
    this.editingBudget = budget;
    this.editData = { ...budget };
  }

  handleSave(): void {
    if (this.editingBudget && this.editData.id) {
      this.budgetService.updateBudget(this.editData.id, this.editData as Budget).subscribe({
        next: (updatedBudget) => {
          const index = this.budgets.findIndex(b => b.id === updatedBudget.id);
          if (index !== -1) {
            this.budgets[index] = updatedBudget;
          }
          this.editingBudget = null;
          this.editData = {};
          this.budgetUpdated.emit();
        },
        error: (err) => {
          console.error("Error updating budget:", err);
          alert("Failed to update budget.");
        }
      });
    }
  }

  handleCancel(): void {
    this.editingBudget = null;
    this.editData = {};
  }

  handleDelete(id: number): void {
    if (window.confirm("Delete this budget?")) {
      this.budgetService.deleteBudget(id).subscribe({
        next: () => {
          this.budgets = this.budgets.filter(b => b.id !== id);
          this.budgetDeleted.emit();
        },
        error: (err) => {
          console.error("Error deleting budget:", err);
          alert("Failed to delete budget.");
        }
      });
    }
  }
}

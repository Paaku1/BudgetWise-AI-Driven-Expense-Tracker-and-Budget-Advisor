import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { CommonModule, CurrencyPipe, PercentPipe, DatePipe } from '@angular/common';
import { SavingGoal } from '../../shared/models/savingGoal';
import { SavingGoalService } from '../../core/services/saving-goal.service';
import { AuthService } from '../../core/services/auth.service';
import { SavingGoalFormComponent } from './saving-goal-form/saving-goal-form';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-saving-goals',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, PercentPipe, DatePipe, SavingGoalFormComponent, FormsModule],
  templateUrl: './saving-goals.html',
  styleUrl: './saving-goals.scss'
})
export class SavingGoalsComponent implements OnInit {
  // ✅ Add EventEmitters
  @Output() goalUpdated = new EventEmitter<void>();
  @Output() goalDeleted = new EventEmitter<void>();
  @Output() addTransactionForCategory = new EventEmitter<string>();


  savingGoals: SavingGoal[] = [];
  isGoalFormVisible = false;
  // ✅ Add properties for editing state
  editingGoal: SavingGoal | null = null;
  editData: Partial<SavingGoal> = {};

  constructor(
    private savingGoalService: SavingGoalService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchGoals();
  }

  onAddTransaction(category: string): void {
    this.addTransactionForCategory.emit(category);
  }

  fetchGoals(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.savingGoalService.getGoals(userId).subscribe(goals => {
        this.savingGoals = goals;
      });
    }
  }

  onAddGoal(): void {
    this.isGoalFormVisible = true;
  }

  onGoalAdded(newGoal: SavingGoal): void {
    this.isGoalFormVisible = false;
    this.fetchGoals(); // Refresh the list after a new goal is added
  }

  handleEdit(goal: SavingGoal): void {
    this.editingGoal = goal;
    this.editData = { ...goal };
  }

  handleSave(): void {
    if (this.editingGoal && this.editData.id) {
      this.savingGoalService.updateGoal(this.editData.id, this.editData as SavingGoal).subscribe({
        next: () => {
          this.fetchGoals(); // Refetch to get the latest data
          this.editingGoal = null;
          this.editData = {};
          this.goalUpdated.emit();
        },
        error: (err) => console.error("Error updating saving goal:", err)
      });
    }
  }

  handleCancel(): void {
    this.editingGoal = null;
    this.editData = {};
  }

  handleDelete(id: number): void {
    if (window.confirm("Delete this saving goal?")) {
      this.savingGoalService.deleteGoal(id).subscribe({
        next: () => {
          this.fetchGoals(); // Refetch to update the list
          this.goalDeleted.emit();
        },
        error: (err) => console.error("Error deleting saving goal:", err)
      });
    }
  }
}

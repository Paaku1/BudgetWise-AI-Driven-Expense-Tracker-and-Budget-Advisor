import { Component, OnInit } from '@angular/core';
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
  savingGoals: SavingGoal[] = [];
  isGoalFormVisible = false;

  constructor(
    private savingGoalService: SavingGoalService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchGoals();
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
    this.fetchGoals();
  }
}

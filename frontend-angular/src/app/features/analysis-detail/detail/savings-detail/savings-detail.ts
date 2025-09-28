import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AnalysisService, SavingsSummary } from '../../../../core/services/analysis.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SavingGoal } from '../../../../shared/models/savingGoal';
import { SavingGoalService } from '../../../../core/services/saving-goal.service';
import { SavingGoalsComponent } from '../../../saving-goals/saving-goals';

@Component({
  selector: 'app-savings-detail',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    SavingGoalsComponent
  ],
  templateUrl: './savings-detail.html',
})
export class SavingsDetailComponent implements OnInit {
  savingsSummary: SavingsSummary | null = null;
  savingGoals: SavingGoal[] = [];

  constructor(
    private analysisService: AnalysisService,
    private authService: AuthService,
    private savingGoalService: SavingGoalService
  ) {}

  ngOnInit(): void {
    this.fetchSavingsData();
  }

  fetchSavingsData(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.analysisService.getSavingsSummary(userId).subscribe(data => this.savingsSummary = data);
    this.savingGoalService.getGoals(userId).subscribe(goals => {
      this.savingGoals = goals.sort((a, b) => (a.savedAmount / a.targetAmount) - (b.savedAmount / b.targetAmount));
    });
  }
}

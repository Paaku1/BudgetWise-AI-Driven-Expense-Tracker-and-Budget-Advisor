import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SavingGoalService} from '../../../core/services/saving-goal.service';
import {AuthService} from '../../../core/services/auth.service';
import {SavingGoal} from '../../../shared/models/savingGoal';
import {TransactionService} from '../../../core/services/transaction.service';

@Component({
  selector: 'app-saving-goal-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './saving-goal-form.html',
  styleUrls: ['./saving-goal-form.scss']
})
export class SavingGoalFormComponent implements OnInit {
  @Output() goalAdded = new EventEmitter<SavingGoal>();
  @Output() closeForm = new EventEmitter<void>();

  goal: Partial<SavingGoal> = {
    category: '',
    targetAmount: 0,
    savedAmount: 0,
    deadline: new Date()
  };

  categories: string[] = [];
  isNewCategory: boolean = false;

  constructor(
    private savingGoalService: SavingGoalService,
    private authService: AuthService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.transactionService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    });
  }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement.value === 'new') {
      this.isNewCategory = true;
      this.goal.category = '';
    } else {
      this.isNewCategory = false;
    }
  }

  onSubmit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.savingGoalService.createGoal(userId, this.goal as SavingGoal).subscribe({
        next: (newGoal) => {
          alert('Saving goal added successfully!');
          this.goalAdded.emit(newGoal);
          this.closeForm.emit();
        },
        error: (err) => {
          console.error('Error adding saving goal:', err);
          alert('Failed to add saving goal. Please try again.');
        }
      });
    }
  }
}

import {Component, OnInit, EventEmitter, Output, Injectable, Input} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../core/services/transaction.service';
import { AuthService } from '../../../core/services/auth.service';
import { Transaction } from '../../../shared/models/transaction';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './transaction-form.html',
  styleUrls: ['./transaction-form.scss']
})

@Injectable({
  providedIn: 'root'
})
export class TransactionFormComponent implements OnInit {
  // ✅ Emits the newly added transaction to the parent component
  @Output() transactionAdded = new EventEmitter<Transaction>();
  @Output() closeForm = new EventEmitter<void>(); // ✅ New output to close the form
  @Input() prefilledCategory: string | null = null; // New Input to receive a pre-filled category

  // ✅ Properties for the new category logic
  categories: string[] = [];
  isNewCategory: boolean  = false;

  transaction: Transaction = {
    id: 0,
    amount: 0,
    type: 'EXPENSE',
    category: '',
    description: '',
    date: new Date()
  };
  transactionTypes = ['EXPENSE', 'INCOME']; // Removed 'SAVINGS' as it's typically a separate account, not a transaction type

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();

    // ✅ Fetch categories from the backend
    this.transactionService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        // Prefill category if provided
        if (this.prefilledCategory) {
          this.transaction.category = this.prefilledCategory;
        }
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    });
  }
  // ✅ New method to handle the category change
  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement.value === 'new') {
      this.isNewCategory = true;
      this.transaction.category = ''; // Clear the category value
    } else {
      this.isNewCategory = false;
    }
  }
  onDelete(category: string){
    if (!category) {
      console.warn('deleteCategory called with empty category');
      return;
    }

    const existed = this.categories.includes(category);

    // Remove the category immutably
    this.categories = this.categories.filter(c => c !== category);

    if (!existed) {
      console.warn(`Category not found: ${category}`);
      return;
    }

    // If the deleted category was selected, reset selection state
    if (this.transaction.category === category) {
      this.transaction.category = '';
      this.isNewCategory = false;
    }

  }

  onSubmit(): void {
    const userId = this.authService.getUserId();

    if (userId) {
      this.transactionService.addTransaction(userId, this.transaction).subscribe({
        next: (response) => {
          alert('Transaction added successfully!');
          this.transactionAdded.emit(response);
          this.closeForm.emit(); // ✅ Emit the close event
        },
        error: (err) => {
          console.error('Error adding transaction:', err);
          alert('Failed to add transaction. Please try again.');
        }
      });
    }
  }
}

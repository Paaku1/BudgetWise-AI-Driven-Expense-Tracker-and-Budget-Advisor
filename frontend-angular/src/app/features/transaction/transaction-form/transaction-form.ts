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
  @Output() transactionAdded = new EventEmitter<Transaction>();
  @Output() closeForm = new EventEmitter<void>();
  @Input() prefilledCategory: string | null = null;
  @Input() prefilledType: 'EXPENSE' | 'INCOME' | 'SAVINGS' | null = null; // ✅ Allow pre-filling type

  categories: string[] = [];
  isNewCategory: boolean  = false;

  transaction: Partial<Transaction> = {
    amount: undefined,
    type: 'EXPENSE',
    category: '',
    description: '',
    date: new Date()
  };
  // ✅ Add SAVINGS to the list of types
  transactionTypes = ['EXPENSE', 'INCOME', 'SAVINGS'];

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.transactionService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        // Prefill category if provided
        if (this.prefilledCategory) {
          this.transaction.category = this.prefilledCategory;
        }
        // ✅ Prefill type if provided
        if (this.prefilledType) {
          this.transaction.type = this.prefilledType;
        }
      }
    });
  }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement.value === 'new') {
      this.isNewCategory = true;
      this.transaction.category = '';
    } else {
      this.isNewCategory = false;
    }
  }

  onSubmit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.transactionService.addTransaction(userId, this.transaction as Transaction).subscribe({
        next: (response) => {
          alert('Transaction added successfully!');
          this.transactionAdded.emit(response);
          this.closeForm.emit();
        }
      });
    }
  }
}

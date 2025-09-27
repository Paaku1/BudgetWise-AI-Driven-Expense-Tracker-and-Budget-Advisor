import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Transaction } from '../../../shared/models/transaction';
import { TransactionService } from '../../../core/services/transaction.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-list.html',
  styleUrls: ['./transaction-list.scss']
})
export class TransactionListComponent implements OnInit {
  @Input() transactions: Transaction[] = [];
  @Output() transactionUpdated = new EventEmitter<void>();
  @Output() transactionDeleted = new EventEmitter<void>();

  editingTransaction: Transaction | null = null;
  editData: Partial<Transaction> = {};
  username: string | null = '';

  constructor(
    private authService: AuthService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername() || 'User';
    // The initial fetch is now handled by the dashboard
  }

  handleEdit(transaction: Transaction): void {
    this.editingTransaction = transaction;
    this.editData = { ...transaction };
  }

  handleSave(): void {
    if (this.editingTransaction && this.editData.id) {
      this.transactionService.editTransaction(this.editData.id, this.editData as Transaction).subscribe({
        next: () => {
          // ✅ Emit the event to notify the parent dashboard
          this.transactionUpdated.emit();
          this.editingTransaction = null;
          this.editData = {};
        },
        error: (err) => {
          console.error("Error updating transaction:", err);
          alert("Failed to update transaction.");
        }
      });
    }
  }

  handleCancel(): void {
    this.editingTransaction = null;
    this.editData = {};
  }

  handleDelete(id: number): void {
    if (window.confirm("Delete this transaction?")) {
      this.transactionService.deleteTransaction(id).subscribe({
        next: () => {
          // ✅ Emit the event to notify the parent dashboard
          this.transactionDeleted.emit();
        },
        error: (err) => {
          console.error("Error deleting transaction:", err);
          alert("Failed to delete transaction.");
        }
      });
    }
  }
}

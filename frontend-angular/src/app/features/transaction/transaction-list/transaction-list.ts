import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {CommonModule, formatCurrency} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

import { Transaction } from '../../../shared/models/transaction';
import { TransactionService } from '../../../core/services/transaction.service';
import { AuthService } from '../../../core/services/auth.service';
import {TransactionFormComponent} from '../transaction-form/transaction-form';

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-list.html',
  styleUrls: ['./transaction-list.scss']
})
export class TransactionListComponent implements OnInit {
  @Input() transactions: Transaction[] = [];

  // Emitters to communicate with the parent Dashboard component
  @Output() transactionUpdated = new EventEmitter<void>();
  @Output() transactionDeleted = new EventEmitter<void>();

  // State to manage editing
  editingTransaction: Transaction | null = null;
  editData: Partial<Transaction> = {};

  // Get username for display purposes
  username: string | null = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private transactionService: TransactionService,
    private transactionForms: TransactionFormComponent
  ) {}

  ngOnInit(): void {
    // ✅ Load the username for display
    this.username = this.authService.getUsername() || 'User';

    const userId = this.authService.getUserId();
    if (userId) {
      this.transactionService.getTransactions(userId).subscribe({
        next: (data) => {
          this.transactions = data;
        },
        error: (err) => {
          console.error('Error fetching transactions:', err);
        }
      });
    } else {
      console.error('User ID not found, cannot fetch transactions.');
    }
  }

  handleEdit(transaction: Transaction): void {
    this.editingTransaction = transaction;
    // Create a copy of the transaction data for editing
    this.editData = { ...transaction };
  }

  // Corrected (and better) approach
  handleSave(): void {
    if (this.editingTransaction && this.editData.id) {
      this.transactionService.editTransaction(this.editData.id, this.editData as Transaction).subscribe({
        next: (updatedTransaction) => {
          // Find the index of the transaction you're editing
          const index = this.transactions.findIndex(t => t.id === updatedTransaction.id);

          if (index !== -1) {
            // Update the local list with the new transaction data
            this.transactions[index] = updatedTransaction;
          }

          // Reset the editing state
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
          // ✅ Update the local transactions array to remove the deleted item
          const transactionToDelete = this.transactions.find(t => t.id === id);

          this.transactions = this.transactions.filter(t => t.id !== id);
          this.transactionForms.onDelete(transactionToDelete?.category || "");
        },
        error: (err) => {
          console.error("Error deleting transaction:", err);
          alert("Failed to delete transaction.");
        }
      });
    }
  }

  protected readonly formatCurrency = formatCurrency;
}

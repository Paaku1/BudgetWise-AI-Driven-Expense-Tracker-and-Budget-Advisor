import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Transaction } from '../../../shared/models/transaction';
import { TransactionService } from '../../../core/services/transaction.service';
import { AuthService } from '../../../core/services/auth.service';
import { TransactionListComponent } from '../transaction-list/transaction-list';

@Component({
  selector: 'app-transactions-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TransactionListComponent],
  templateUrl: './transactions-page.html',
  styleUrls: ['./transactions-page.scss']
})
export class TransactionsPageComponent implements OnInit {
  transactions: Transaction[] = [];
  months: { name: string, value: string }[] = [];
  categories: string[] = [];
  filters = {
    type: '',
    category: '',
    startDate: '',
    endDate: '',
    selectedMonth: ''
  };

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.generateMonthList();
    this.applyFilters();
    this.fetchCategories();
  }

  fetchCategories(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.transactionService.getCategories().subscribe(data => {
        this.categories = data;
      });
    }
  }

  generateMonthList() {
    const date = new Date();
    for (let i = 0; i < 12; i++) {
      const month = new Date(date.getFullYear(), date.getMonth() - i, 1);
      this.months.push({
        name: month.toLocaleString('default', { month: 'long', year: 'numeric' }),
        value: `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`
      });
    }
  }

  onMonthChange() {
    if (this.filters.selectedMonth) {
      const [year, month] = this.filters.selectedMonth.split('-');
      this.filters.startDate = `${year}-${month}-01`;
      const lastDay = new Date(Number(year), Number(month), 0).getDate();
      this.filters.endDate = `${year}-${month}-${lastDay}`;
    } else {
      this.filters.startDate = '';
      this.filters.endDate = '';
    }
  }

  applyFilters() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.transactionService.getFilteredTransactions(userId, this.filters).subscribe(data => {
        this.transactions = data;
      });
    }
  }

  clearFilters() {
    this.filters = { type: '', category: '', startDate: '', endDate: '', selectedMonth: '' };
    this.applyFilters();
  }

  refreshData() {
    this.applyFilters();
  }
}

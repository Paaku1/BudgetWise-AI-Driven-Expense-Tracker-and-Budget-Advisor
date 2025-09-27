import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { NavBarComponent } from './shared/nav-bar/nav-bar';
import { AuthService } from './core/services/auth.service';
import {BreadcrumbComponent} from './shared/breadcrumb/breadcrumb';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavBarComponent, BreadcrumbComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor(private authService: AuthService) {
    Chart.register(...registerables);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}

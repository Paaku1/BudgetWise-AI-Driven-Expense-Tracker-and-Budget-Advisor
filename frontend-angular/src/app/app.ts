import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { NavBarComponent } from './shared/nav-bar/nav-bar'; // ✅ Import the nav-bar
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavBarComponent], // ✅ Add NavBarComponent
  templateUrl: './app.html',
})
export class App {
  constructor(private authService: AuthService) {
    Chart.register(...registerables);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}

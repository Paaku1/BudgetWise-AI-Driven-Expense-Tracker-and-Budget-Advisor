import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';
import {AuthService} from '../core/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    NgOptimizedImage
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent{

  constructor(
    private authService: AuthService
  ) {
  }

  loggedIn() {
    return this.authService.isLoggedIn()
  }
}

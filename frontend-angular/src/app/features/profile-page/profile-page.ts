import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import {Details} from '../../shared/models/details';
import {BreadcrumbService} from '../../core/services/breadcrumb.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-page.html',
  styleUrls: ['./profile-page.scss']
})
export class ProfilePageComponent implements OnInit {
  details: Partial<Details> = {};
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Dashboard', url: '/dashboard' },
      { label: 'Profile', url: '' } // Last item has no URL
    ]);
  }

  loadUserProfile(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.profileService.getProfile(userId).subscribe(profile => {
        this.details = profile;
      });
    }
  }

  updateUserDetails(): void {
    const userId = this.authService.getUserId();
    if (userId && this.details) {
      this.profileService.updateUser(userId, this.details).subscribe(response => {
        // ✅ Save the new token to local storage
        this.authService.saveAuthData(response.token, response.userId, response.firstname);
        alert('User details updated successfully!');
      });
    }
  }

  updateProfileDetails(): void {
    const userId = this.authService.getUserId();
    if (userId && this.details) {
      this.profileService.updateProfile(userId, this.details).subscribe(() => {
        alert('Profile details updated successfully!');
      });
    }
  }

  changePassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    const userId = this.authService.getUserId();
    if (userId) {
      this.profileService.changePassword(userId, this.currentPassword, this.newPassword).subscribe({
        next: () => {
          alert('Password changed successfully!');
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        },
        error: (err) => {
          alert('Error changing password: ' + (err.error?.message || 'Please try again'));
        }
      });
    }
  }
}

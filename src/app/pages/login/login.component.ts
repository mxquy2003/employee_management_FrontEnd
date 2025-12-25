import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div class="card p-4 shadow" style="width: 350px;">
        <h3 class="text-center mb-3">Đăng Nhập</h3>
        <div class="mb-3">
          <label>Username</label>
          <input [(ngModel)]="username" class="form-control" placeholder="admin">
        </div>
        <div class="mb-3">
          <label>Password</label>
          <input [(ngModel)]="password" type="password" class="form-control" placeholder="yourpassword">
        </div>
        <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
        <button (click)="onLogin()" class="btn btn-primary w-100">Login</button>
      </div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  onLogin() {
    this.api.login({ username: this.username, password: this.password }).subscribe({
      next: (res: any) => {
        localStorage.setItem('access_token', res.token);
        this.router.navigate(['/employees']);
      },
      error: () => this.error = 'Sai thông tin đăng nhập!'
    });
  }
}
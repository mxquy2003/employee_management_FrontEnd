import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav class="navbar navbar-expand navbar-dark bg-dark px-3">
      <a class="navbar-brand" href="#">Employee System</a>
      <div class="navbar-nav me-auto">
        <a class="nav-link" routerLink="/employees" routerLinkActive="active">Nhân viên</a>
        <a class="nav-link" routerLink="/languages" routerLinkActive="active">Ngoại ngữ</a>
        <a class="nav-link" routerLink="/certificates" routerLinkActive="active">Chứng chỉ</a>
      </div>
      <button class="btn btn-outline-light btn-sm" (click)="logout()">Đăng xuất</button>
    </nav>
    <div class="container mt-4">
      <router-outlet></router-outlet>
    </div>
  `
})
export class LayoutComponent {
  constructor(private router: Router) {}
  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
}
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-language',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Quản lý Ngoại ngữ</h2>
    
    <div class="card p-3 mb-3">
      <div *ngIf="errorMessage" class="alert alert-danger p-2 mb-2">
        {{ errorMessage }}
      </div>

      <div class="row g-2">
        <div class="col-md-5">
          <input [(ngModel)]="form.name" class="form-control" placeholder="Tên (VD: English)" 
                 [class.is-invalid]="errorMessage && !form.name">
        </div>
        <div class="col-md-5">
          <input [(ngModel)]="form.level" class="form-control" placeholder="Trình độ (VD: B2)"
                 [class.is-invalid]="errorMessage && !form.level">
        </div>
        
        <div class="col-md-2 d-flex gap-1">
          <button *ngIf="!isEdit" (click)="save()" class="btn btn-success w-100">Thêm</button>
          
          <ng-container *ngIf="isEdit">
            <button (click)="save()" class="btn btn-primary w-50">Lưu</button>
            <button (click)="cancel()" class="btn btn-secondary w-50">Hủy</button>
          </ng-container>
        </div>
      </div>
    </div>

    <table class="table table-bordered table-hover">
      <thead class="table-light">
        <tr>
          <th>ID</th>
          <th>Tên</th>
          <th>Trình độ</th>
          <th style="width: 150px;">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let l of list">
          <td>{{ l.id }}</td>
          <td>{{ l.name }}</td>
          <td>{{ l.level }}</td>
          <td>
            <button class="btn btn-warning btn-sm me-2" (click)="edit(l)">Sửa</button>
            <button class="btn btn-danger btn-sm" (click)="remove(l.id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
  `
})
export class LanguageComponent implements OnInit {
  list: any[] = [];
  form = { name: '', level: '' };
  isEdit = false;
  currentId: number | null = null;
  errorMessage = '';

  constructor(
    private api: ApiService, 
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit() { this.load(); }

  load() { 
    this.api.getLanguages().subscribe(data => {
      this.list = data;
      this.cdr.detectChanges();
    }); 
  }

  save() {
    this.errorMessage = '';

    if (!this.form.name.trim() || !this.form.level.trim()) {
      this.errorMessage = 'Vui lòng nhập đầy đủ Tên và Trình độ!';
      return;
    }

    const observer = {
      next: () => {
        this.cancel();
        this.load();   
      },
      error: (err: any) => {
        console.log('Error details:', err); 
        this.handleError(err);
      }
    };

    if (this.isEdit && this.currentId) {
      this.api.updateLanguage(this.currentId, this.form).subscribe(observer);
    } else {
      this.api.createLanguage(this.form).subscribe(observer);
    }
  }

  edit(l: any) {
    this.isEdit = true;
    this.currentId = l.id;
    this.form = { name: l.name, level: l.level };
    this.errorMessage = ''; 
  }

  cancel() {
    this.isEdit = false;
    this.currentId = null;
    this.form = { name: '', level: '' };
    this.errorMessage = '';
  }

  remove(id: number) { 
    if(confirm('Bạn có chắc muốn xóa?')) {
      this.api.deleteLanguage(id).subscribe({
        next: () => {
          this.errorMessage = '';
          this.load();
        },
        error: (err: any) => {
          this.handleError(err);
        }
      });
    }
  }

  private handleError(err: any) {
    if (err.error && typeof err.error === 'object') {
      this.errorMessage = err.error.message || err.error.error || 'Đã có lỗi xảy ra';
    } else if (typeof err.error === 'string') {
      this.errorMessage = err.error;
    } else {
      this.errorMessage = 'Lỗi không xác định (' + err.status + ')';
    }
    
    this.cdr.detectChanges();
  }
}
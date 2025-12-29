import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Quản lý Chứng chỉ</h2>
    
    <div class="card p-3 mb-3">
      <div *ngIf="errorMessage" class="alert alert-danger p-2 mb-2">
        {{ errorMessage }}
      </div>

      <div class="row g-2">
        <div class="col-md-10">
          <input [(ngModel)]="form.name" class="form-control" placeholder="Tên chứng chỉ (VD: TOEIC 900)"
                 [class.is-invalid]="errorMessage && !form.name">
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
          <th>Tên Chứng chỉ</th>
          <th style="width: 150px;">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let c of list">
          <td>{{ c.id }}</td>
          <td>{{ c.name }}</td>
          <td>
            <button class="btn btn-warning btn-sm me-2" (click)="edit(c)">Sửa</button>
            <button class="btn btn-danger btn-sm" (click)="remove(c.id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
  `
})  
export class CertificateComponent implements OnInit {
  list: any[] = [];
  form = { name: '' };
  isEdit = false;
  currentId: number | null = null;
  errorMessage = '';

  constructor(
    private api: ApiService, 
    private cdr: ChangeDetectorRef 
  ) {}
  
  ngOnInit() { this.load(); }

  load() { 
    this.api.getCertificates().subscribe(data => {
      this.list = data;
      this.cdr.detectChanges();
    }); 
  }

  save() {
    this.errorMessage = '';

    if (!this.form.name.trim()) {
      this.errorMessage = 'Vui lòng nhập tên chứng chỉ!';
      return;
    }

    const observer = {
      next: () => {
        this.cancel();
        this.load(); 
      },
      error: (err: any) => {
        this.handleError(err);
      }
    };

    if (this.isEdit && this.currentId) {
      this.api.updateCertificate(this.currentId, this.form).subscribe(observer);
    } else {
      this.api.createCertificate(this.form).subscribe(observer);
    }
  }

  edit(c: any) {
    this.isEdit = true;
    this.currentId = c.id;
    this.form = { name: c.name }; 
    this.errorMessage = '';
  }

  cancel() {
    this.isEdit = false;
    this.currentId = null;
    this.form = { name: '' };
    this.errorMessage = '';
  }

  remove(id: number) { 
    if(confirm('Bạn có chắc muốn xóa chứng chỉ này?')) {
      this.api.deleteCertificate(id).subscribe({
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
    console.error(err); 
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
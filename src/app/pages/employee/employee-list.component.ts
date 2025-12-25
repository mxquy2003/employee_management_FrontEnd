import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card card-custom">
      <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
        <h5 class="mb-0 fw-bold text-dark">Danh sách Nhân viên</h5>
        <button *ngIf="isAdmin" class="btn btn-primary-custom" (click)="openModal()">
          + Thêm mới
        </button>
      </div>
      
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light text-secondary">
              <tr>
                <th class="ps-4 py-3">ID</th>
                <th>Họ và Tên</th>
                <th>Ngày sinh</th>
                <th>Địa chỉ</th> 
                <th>Ngoại ngữ</th>
                <th>Chứng chỉ</th> 
                <th class="text-end pe-4" *ngIf="isAdmin">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let emp of employees">
                <td class="ps-4 fw-bold">#{{emp.id}}</td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar-circle me-2">{{emp.name.charAt(0)}}</div>
                    <div>
                        <div class="fw-medium">{{emp.name}}</div>
                        <div class="small text-muted">{{emp.phone}}</div>
                    </div>
                  </div>
                </td>
                <td>{{emp.dob | date:'dd/MM/yyyy'}}</td>
                <td>{{emp.address}}</td> 
                <td>
                  <div *ngFor="let l of emp.languages" class="badge bg-info text-dark me-1 mb-1">
                    {{l.name}} - {{l.level}}
                  </div>
                  <span *ngIf="!emp.languages?.length" class="text-muted small">-</span>
                </td>
                <td>
                  <div *ngFor="let c of emp.certificates" class="badge bg-warning text-dark me-1 mb-1">
                    {{c.name}}
                  </div>
                  <span *ngIf="!emp.certificates?.length" class="text-muted small">-</span>
                </td>
                <td class="text-end pe-4" *ngIf="isAdmin">
                  <button class="btn btn-sm btn-outline-primary me-2" (click)="edit(emp)">Sửa</button>
                  <button class="btn btn-sm btn-outline-danger" (click)="delete(emp.id)">Xóa</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="modal-backdrop-custom" *ngIf="showModal">
      <div class="modal-dialog-custom">
        <div class="card card-custom shadow-lg">
          <div class="card-header bg-white border-bottom py-3">
            <h5 class="mb-0 fw-bold">{{ isEdit ? 'Cập nhật Nhân viên' : 'Thêm Nhân viên mới' }}</h5>
          </div>
          
          <div class="card-body p-4">
            <div *ngIf="serverError" class="alert alert-danger p-2 mb-3 small">
                {{ serverError }}
            </div>

            <form #empForm="ngForm">
              <div class="row g-3">
                
                <div class="col-md-12">
                  <label class="form-label small fw-bold text-secondary">Họ tên <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" [(ngModel)]="form.name" name="name" 
                         required minlength="2" maxlength="100" #nameModel="ngModel" 
                         [class.is-invalid]="(nameModel.invalid && (nameModel.dirty || nameModel.touched)) || fieldErrors['name']">
                  
                  <div class="invalid-feedback" *ngIf="nameModel.errors?.['required']">Vui lòng nhập họ tên.</div>
                  <div class="invalid-feedback" *ngIf="nameModel.errors?.['minlength']">Tên phải từ 2 ký tự trở lên.</div>
                  <div class="text-danger small mt-1" *ngIf="fieldErrors['name']">{{ fieldErrors['name'] }}</div>
                </div>

                <div class="col-md-6">
                  <label class="form-label small fw-bold text-secondary">Ngày sinh <span class="text-danger">*</span></label>
                  <input type="date" class="form-control" [(ngModel)]="form.dob" name="dob" 
                         required [max]="today"
                         #dobModel="ngModel" 
                         [class.is-invalid]="(dobModel.invalid && (dobModel.dirty || dobModel.touched)) || (form.dob > today) || fieldErrors['dob']">
                   
                   <div class="invalid-feedback" *ngIf="dobModel.errors?.['required']">Vui lòng chọn ngày sinh.</div>
                   
                   <div class="text-danger small mt-1" *ngIf="form.dob > today">
                     Ngày sinh không được lớn hơn hôm nay.
                   </div>
                   
                   <div class="text-danger small mt-1" *ngIf="fieldErrors['dob']">{{ fieldErrors['dob'] }}</div>
                </div>

                <div class="col-md-6">
                  <label class="form-label small fw-bold text-secondary">Điện thoại <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" [(ngModel)]="form.phone" name="phone" 
                         required pattern="^[0-9]{10}$" #phoneModel="ngModel" 
                         [class.is-invalid]="(phoneModel.invalid && (phoneModel.dirty || phoneModel.touched)) || fieldErrors['phone']">
                  <div class="invalid-feedback" *ngIf="phoneModel.errors?.['required']">Nhập số điện thoại.</div>
                  <div class="invalid-feedback" *ngIf="phoneModel.errors?.['pattern']">SĐT phải là 10 chữ số.</div>
                  <div class="text-danger small mt-1" *ngIf="fieldErrors['phone']">{{ fieldErrors['phone'] }}</div>
                </div>
                
                <div class="col-md-12">
                  <label class="form-label small fw-bold text-secondary">Địa chỉ</label>
                  <input type="text" class="form-control" [(ngModel)]="form.address" name="address"
                         [class.is-invalid]="fieldErrors['address']">
                  <div class="text-danger small mt-1" *ngIf="fieldErrors['address']">{{ fieldErrors['address'] }}</div>
                </div>

                <div class="col-md-12">
                  <label class="form-label small fw-bold text-secondary">Ngoại ngữ</label>
                  <select multiple class="form-select" [(ngModel)]="form.languageIds" name="languageIds" style="height: 100px;">
                    <option *ngFor="let l of languages" [value]="l.id">
                      {{l.name}} ({{l.level}})
                    </option>
                  </select>
                  <small class="text-muted" style="font-size: 0.75rem">* Giữ phím Ctrl để chọn nhiều</small>
                </div>

                <div class="col-md-12">
                  <label class="form-label small fw-bold text-secondary">Chứng chỉ</label>
                  <div class="d-flex flex-wrap gap-2 border p-2 rounded bg-light">
                     <div *ngFor="let c of certificates" class="form-check">
                        <input class="form-check-input" type="checkbox"
                               [id]="'cert-'+c.id"
                               [value]="c.id" 
                               (change)="toggleCert(c.id, $event)"
                               [checked]="form.certificateIds.includes(c.id)">
                        <label class="form-check-label" [for]="'cert-'+c.id">{{c.name}}</label>
                     </div>
                  </div>
                </div>

              </div>
            </form>
          </div>
          
          <div class="card-footer bg-light border-0 py-3 text-end">
            <button class="btn btn-light me-2 text-secondary" (click)="closeModal()">Hủy bỏ</button>
            
            <button class="btn btn-primary-custom" (click)="save()" 
                    [disabled]="empForm.invalid || (form.dob > today)">
              {{ isEdit ? 'Lưu thay đổi' : 'Tạo mới' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .avatar-circle { width: 40px; height: 40px; background-color: #eef2ff; color: #4e73df; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
    .modal-backdrop-custom { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1050; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(2px); }
    .modal-dialog-custom { width: 100%; max-width: 600px; animation: slideDown 0.3s ease-out; }
    @keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `]
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  languages: any[] = [];
  certificates: any[] = [];

  showModal = false;
  isEdit = false;
  currentId: number | null = null;
  isAdmin: boolean = false;


  today: string = new Date().toISOString().split('T')[0];

  form: any = {
    name: '', dob: '', address: '', phone: '',
    languageIds: [], certificateIds: []
  };

  fieldErrors: any = {};
  serverError: string = '';

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.checkRole();
    this.loadAll();
    this.api.getLanguages().subscribe(d => this.languages = d);
    this.api.getCertificates().subscribe(d => this.certificates = d);
  }

  checkRole() {
    const role = this.api.getRole();
    this.isAdmin = role === 'ADMIN'; 
  }

  loadAll() {
    this.api.getEmployees().subscribe(data => {
      this.employees = data;
      this.cdr.detectChanges(); 
    });
  }

  openModal() {
    if (!this.isAdmin) return;
    this.resetForm();
    this.fieldErrors = {};
    this.serverError = '';
    this.showModal = true;
    this.isEdit = false;
  }

  closeModal() {
    this.showModal = false;
  }

  edit(e: any) {
    if (!this.isAdmin) return;
    this.isEdit = true;
    this.currentId = e.id;
    this.fieldErrors = {};
    this.serverError = '';
    
    this.form = { 
      name: e.name, 
      dob: e.dob, 
      address: e.address, 
      phone: e.phone,
      languageIds: e.languages ? e.languages.map((l: any) => l.id) : [],
      certificateIds: e.certificates ? e.certificates.map((c: any) => c.id) : []
    };
    this.showModal = true;
  }

  delete(id: number) {
    if (!this.isAdmin) return;
    if(confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      this.api.deleteEmployee(id).subscribe(() => this.loadAll());
    }
  }

  save() {
    if (!this.isAdmin) return;

    if (this.form.dob > this.today) {
        alert("Ngày sinh không hợp lệ!");
        return;
    }

    this.fieldErrors = {};
    this.serverError = '';

    const observer = {
      next: () => {
        this.closeModal();
        this.loadAll();
      },
      error: (err: any) => {
        if (err.status === 400 && err.error) {
            if (typeof err.error === 'object' && !err.error.error) {
                this.fieldErrors = err.error;
            } else {
                this.serverError = err.error.error || 'Dữ liệu không hợp lệ.';
            }
        } else {
            this.serverError = 'Lỗi kết nối đến server.';
        }
      }
    };

    if (this.isEdit && this.currentId) {
      this.api.updateEmployee(this.currentId, this.form).subscribe(observer);
    } else {
      this.api.createEmployee(this.form).subscribe(observer);
    }
  }

  resetForm() {
    this.form = { name: '', dob: '', address: '', phone: '', languageIds: [], certificateIds: [] };
  }

  toggleCert(id: number, event: any) {
    if (event.target.checked) {
      this.form.certificateIds.push(id);
    } else {
      this.form.certificateIds = this.form.certificateIds.filter((cid: number) => cid !== id);
    }
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8080/employee_management/api';

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }
  
  getRole(): string | null {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(decodedJson);
      return payload.role || null;
    } catch (e) {
      return null;
    }
  }

  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/employees`);
  }
  createEmployee(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/employees`, data);
  }
  updateEmployee(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/employees/${id}`, data);
  }
  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/employees/${id}`);
  }

  getLanguages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/languages`);
  }
  createLanguage(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/languages`, data);
  }
  updateLanguage(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/languages/${id}`, data);
  }
  deleteLanguage(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/languages/${id}`);
  }

  getCertificates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/certificates`);
  }
  createCertificate(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/certificates`, data);
  }
  deleteCertificate(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/certificates/${id}`);
  }
  updateCertificate(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/certificates/${id}`, data);
  }
}
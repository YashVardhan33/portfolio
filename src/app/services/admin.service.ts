import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('admin_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async login(credentials: any): Promise<any> {
    return firstValueFrom(this.http.post('/api/admin/login', credentials));
  }

  async getPortfolioItems(): Promise<any[]> {
    return firstValueFrom(
      this.http.get<any[]>('/api/admin/items', { headers: this.getHeaders() })
    );
  }

  async createPortfolioItem(item: any): Promise<any> {
    return firstValueFrom(
      this.http.post('/api/admin/items', item, { headers: this.getHeaders() })
    );
  }

  async updatePortfolioItem(itemId: string, item: any): Promise<any> {
    return firstValueFrom(
      this.http.put(`/api/admin/${itemId}`, item, { headers: this.getHeaders() })
    );
  }

  async deletePortfolioItem(itemId: string): Promise<any> {
    return firstValueFrom(
      this.http.delete(`/api/admin/${itemId}`, { headers: this.getHeaders() })
    );
  }
}

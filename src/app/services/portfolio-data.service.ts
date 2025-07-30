import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortfolioDataService {
  private portfolioItemsSubject = new BehaviorSubject<any[]>([]);
  public portfolioItems$ = this.portfolioItemsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadPortfolioItems();
  }

  async loadPortfolioItems() {
    try {
      const items = await firstValueFrom(
        this.http.get<any[]>('/api/portfolio/items')
      );
      this.portfolioItemsSubject.next(items);
    } catch (error) {
      console.error('Error loading portfolio items:', error);
    }
  }

  async getPortfolioItem(id: string): Promise<any> {
    return firstValueFrom(
      this.http.get(`/api/portfolio/${id}`)
    );
  }

  getPortfolioItems(): any[] {
    return this.portfolioItemsSubject.value;
  }
}

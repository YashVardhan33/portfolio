import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { About } from '../models/about.model';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioDataService {
  private apiUrl = environment.apiUrl+'/portfolio';

  constructor(private http: HttpClient) { }

  getAbout(): Observable<About> {
    return this.http.get<About>(`${this.apiUrl}/about`);
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/projects`);
  }

  getSkills(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/projects`);
  }
}

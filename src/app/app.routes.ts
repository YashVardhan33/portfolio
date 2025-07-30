import { Routes } from '@angular/router';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {path:'admin', component: AdminPanelComponent},
  {path:'', component:HomeComponent},
  {path:'**', redirectTo:''}

];

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent implements OnInit {
  isAuthenticated = false;
  portfolioItems: any[] = [];
  editingItem: any = null;

  loginForm: FormGroup;
  itemForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.itemForm = this.fb.group({
      id: ['', Validators.required],
      label: ['', Validators.required],
      icon: ['', Validators.required],
      type: ['about', Validators.required],
      content: ['', Validators.required],
      order: [0, Validators.required],
      isActive: [true]
    });
  }

  ngOnInit() {
    this.checkAuthentication();
  }

  checkAuthentication() {
    const token = localStorage.getItem('admin_token');
    if (token) {
      this.isAuthenticated = true;
      this.loadPortfolioItems();
    }
  }

  async login() {
    if (this.loginForm.valid) {
      try {
        const result = await this.adminService.login(this.loginForm.value);
        localStorage.setItem('admin_token', result.token);
        this.isAuthenticated = true;
        this.loadPortfolioItems();
      } catch (error) {
        alert('Invalid credentials');
      }
    }
  }

  logout() {
    localStorage.removeItem('admin_token');
    this.isAuthenticated = false;
  }

  async loadPortfolioItems() {
    try {
      this.portfolioItems = await this.adminService.getPortfolioItems();
    } catch (error) {
      console.error('Error loading portfolio items:', error);
    }
  }

  async saveItem() {
    if (this.itemForm.valid) {
      try {
        if (this.editingItem) {
          await this.adminService.updatePortfolioItem(this.editingItem._id, this.itemForm.value);
        } else {
          await this.adminService.createPortfolioItem(this.itemForm.value);
        }

        this.loadPortfolioItems();
        this.resetForm();
      } catch (error) {
        alert('Error saving item');
      }
    }
  }

  editItem(item: any) {
    this.editingItem = item;
    this.itemForm.patchValue(item);
  }

  cancelEdit() {
    this.editingItem = null;
    this.resetForm();
  }

  async deleteItem(itemId: string) {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await this.adminService.deletePortfolioItem(itemId);
        this.loadPortfolioItems();
      } catch (error) {
        alert('Error deleting item');
      }
    }
  }

  resetForm() {
    this.itemForm.reset({
      type: 'about',
      order: 0,
      isActive: true
    });
    this.editingItem = null;
  }
}

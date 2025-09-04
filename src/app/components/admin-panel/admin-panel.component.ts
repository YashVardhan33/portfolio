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

  public isLoading = false;
  public message: string | null = null;
  public messageType: 'success' | 'error' | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly adminService: AdminService
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
      this.isLoading = true;
      this.message = null;
      try {
        const result = await this.adminService.login(this.loginForm.value);
        localStorage.setItem('admin_token', result.token);
        this.isAuthenticated = true;
        this.message = 'Login successful!';
        this.messageType = 'success';
        this.loadPortfolioItems();
      } catch (error: any) {
        console.error('Login error:', error);
        this.message = 'Invalid credentials';
        this.messageType = 'error';
      } finally {
        this.isLoading = false;
      }
    }
  }

  logout() {
    localStorage.removeItem('admin_token');
    this.isAuthenticated = false;
  }

  async loadPortfolioItems() {
    this.isLoading = true;
    this.message = null;
    try {
      this.portfolioItems = await this.adminService.getPortfolioItems();
    } catch (error: any) {
      if (error.status === 401) {
        this.logout();
        this.message = 'Session expired. Please log in again.';
        this.messageType = 'error';
      } else {
        this.message = 'Error loading portfolio items';
        this.messageType = 'error';
        console.error('Error loading portfolio items:', error);
      }
    } finally {
      this.isLoading = false;
    }
  }

  async saveItem() {
    if (this.itemForm.valid) {
      this.isLoading = true;
      this.message = null;
      try {
        if (this.editingItem) {
          await this.adminService.updatePortfolioItem(this.editingItem._id, this.itemForm.value);
          this.message = 'Item updated successfully!';
        } else {
          await this.adminService.createPortfolioItem(this.itemForm.value);
          this.message = 'Item added successfully!';
        }
        this.messageType = 'success';
        this.loadPortfolioItems();
        this.resetForm();
      } catch (error: any) {
        if (error.status === 401) {
          this.logout();
          this.message = 'Session expired. Please log in again.';
        } else {
          this.message = 'Error saving item';
        }
        this.messageType = 'error';
      } finally {
        this.isLoading = false;
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
      this.isLoading = true;
      this.message = null;
      try {
        await this.adminService.deletePortfolioItem(itemId);
        this.message = 'Item deleted successfully!';
        this.messageType = 'success';
        this.loadPortfolioItems();
      } catch (error: any) {
        if (error.status === 401) {
          this.logout();
          this.message = 'Session expired. Please log in again.';
        } else {
          this.message = 'Error deleting item';
        }
        this.messageType = 'error';
      } finally {
        this.isLoading = false;
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

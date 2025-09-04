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
      this.handleApiError(error, 'load');
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
        // Auto-dismiss success message after 3 seconds
        setTimeout(() => {
          if (this.messageType === 'success') {
            this.message = null;
          }
        }, 3000);
      } catch (error: any) {
        this.handleApiError(error, this.editingItem ? 'update' : 'add');
      } finally {
        this.isLoading = false;
      }
    } else {
      this.message = 'Please fill in all required fields correctly.';
      this.messageType = 'error';
      this.markFormGroupTouched(this.itemForm);
    }
  }

  private handleApiError(error: any, operation: string) {
    if (error.status === 401) {
      this.logout();
      this.message = 'Session expired. Please log in again.';
    } else if (error.status === 0) {
      this.message = 'Network error: Could not connect to the server. Please check your connection.';
    } else if (error.status === 500) {
      this.message = 'Server error: Please try again later.';
    } else if (error.error?.message) {
      this.message = `Error: ${error.error.message}`;
    } else {
      const operationMap: { [key: string]: string } = {
        'add': 'Failed to add item. Please try again.',
        'update': 'Failed to update item. Please try again.',
        'delete': 'Failed to delete item. Please try again.',
        'load': 'Failed to load portfolio items. Please try again.'
      };
      this.message = operationMap[operation] || 'An error occurred. Please try again.';
    }
    this.messageType = 'error';
    console.error(`Error ${operation}ing item:`, error);
  }

  editItem(item: any) {
    this.editingItem = item;
    this.itemForm.patchValue(item);
    this.itemForm.get('id')?.disable();
    this.message = null; // Clear any previous messages
  }

  cancelEdit() {
    this.editingItem = null;
    this.resetForm();
    this.message = null; // Clear any previous messages
  }

  async deleteItem(itemId: string) {
    const confirmMessage = 'Are you sure you want to delete this item? This action cannot be undone.';
    if (confirm(confirmMessage)) {
      this.isLoading = true;
      this.message = null;
      try {
        await this.adminService.deletePortfolioItem(itemId);
        this.message = 'Item deleted successfully!';
        this.messageType = 'success';
        this.loadPortfolioItems();
        // Auto-dismiss success message after 3 seconds
        setTimeout(() => {
          if (this.messageType === 'success') {
            this.message = null;
          }
        }, 3000);
      } catch (error: any) {
        this.handleApiError(error, 'delete');
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
    this.itemForm.get('id')?.enable(); // Re-enable ID field for new items
    this.editingItem = null;
    this.message = null; // Clear any previous messages
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  trackByItemId(index: number, item: any): string {
    return item._id ?? item.id ?? index.toString();
  }
}

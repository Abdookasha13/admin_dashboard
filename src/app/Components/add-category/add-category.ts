import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../Services/category-service';
import { Icategory } from '../../Models/icategory';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-category',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-category.html',
  styleUrl: './add-category.scss',
})
export class AddCategory implements OnInit {
  category: Icategory = {} as Icategory;
  categoryId: string | null = null;

  categoryIcons = [
    { label: 'Web Design', icon: 'bi bi-palette-fill' },
    { label: 'Graphic Design', icon: 'bi bi-brush-fill' },
    { label: 'IT & Software', icon: 'bi bi-code-slash' },
    { label: 'Sales & Marketing', icon: 'bi bi-megaphone-fill' },
    { label: 'Mobile Application', icon: 'bi bi-phone-fill' },
    { label: 'Finance & Accounting', icon: 'bi bi-currency-dollar' },
    { label: 'Art & Humanities', icon: 'bi bi-star-fill' },
    { label: 'Personal Development', icon: 'bi bi-person-fill' },
  ];

  constructor(
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    if (this.categoryId) {
      this.categoryService.getCategoryById(this.categoryId).subscribe({
        next: (data) => {
          this.category = data;
        },
        error: (error) => {
          this.toastr.error('Error fetching category details');
        },
      });
    }
  }

  addCategory() {
    if (this.categoryId) {
      this.categoryService.updateCategoryById(this.categoryId, this.category).subscribe({
        next: (data) => {
          this.toastr.success('Category updated successfully!');
          this.router.navigate(['/layout/categories']);
        },
        error: (error) => {
          this.toastr.error('Failed to update category');
        },
      });
    } else {
      this.categoryService.addCategory(this.category).subscribe({
        next: (data) => {
          console.log('Add category response:', data);
          this.toastr.success('Category added successfully!');
          this.router.navigate(['/layout/categories']);
        },
        error: (error) => {
          this.toastr.error('Failed to add category');
          console.error('Add category error:', error);
        },
      });
    }
  }
}

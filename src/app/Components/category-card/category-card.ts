import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Icategory } from '../../Models/icategory';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../Services/category-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-card',
  imports: [CommonModule],
  templateUrl: './category-card.html',
  styleUrl: './category-card.scss',
})
export class CategoryCard {
  @Input() category: Icategory = {} as Icategory;
  @Output() deleted = new EventEmitter<string>();
  isDeleteModalOpen: boolean = false;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private categoryService: CategoryService
  ) {}

  navigateToEdit() {
    this.router.navigate(['/layout/editCategory', this.category._id]);
  }
  openDeleteModal() {
    this.isDeleteModalOpen = true;
  }
  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }
  confirmDelete() {
    this.categoryService.deleteCategoryById(this.category._id as string).subscribe(() => {
      this.toastr.success('Category deleted successfully');
      this.deleted.emit(this.category._id as string);
      this.closeDeleteModal();
    });
  }
}

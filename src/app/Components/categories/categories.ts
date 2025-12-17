import { Component, OnInit, OnDestroy } from '@angular/core';
import { Icategory } from '../../Models/icategory';
import { CategoryService } from '../../Services/category-service';
import { SearchService } from '../../Services/search-service';
import { CategoryCard } from '../category-card/category-card';
import { Subscription } from 'rxjs';
import { Loader } from "../loader/loader";

@Component({
  selector: 'app-categories',
  imports: [CategoryCard, Loader],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories implements OnInit, OnDestroy {
  categories: Icategory[] = [];
  filteredCategories: Icategory[] = [];
  private searchSubscription?: Subscription;
  loading: boolean = true;

  constructor(
    private categoryService: CategoryService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.filteredCategories = data;
        console.log("cat", data);        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
        this.loading = false;
      },
    });

    this.searchSubscription = this.searchService.searchTerm$.subscribe((term) => {
      this.filterCategories(term);
    });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  filterCategories(searchTerm: string) {
    if (!searchTerm || searchTerm.trim() === '') {
      this.filteredCategories = this.categories;
    } else {
      const term = searchTerm.toLowerCase();
      this.filteredCategories = this.categories.filter((cat) =>
        cat.name.en.toLowerCase().includes(term)
      );
    }
  }

  removeCategory(id: string) {
    this.categories = this.categories.filter((c) => c._id !== id);
    this.filteredCategories = this.filteredCategories.filter((c) => c._id !== id);
  }
}

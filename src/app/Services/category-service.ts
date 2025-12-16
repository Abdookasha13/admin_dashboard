import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Icategory } from '../Models/icategory';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private httpClient: HttpClient) {}

   private getHeaders() {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
}

  // -------------------get all categories-------------------
  getAllCategories():Observable<Icategory[]>{
    return this.httpClient.get<Icategory[]>('http://localhost:1911/category');
  }

  // -------------------add new category-------------------
  addCategory(category:Icategory):Observable<Icategory>{
    return this.httpClient.post<Icategory>('http://localhost:1911/category', category, this.getHeaders());
  }

  // -------------------get category by id-------------------
  getCategoryById(categoryId:string):Observable<Icategory>{
    return this.httpClient.get<Icategory>(`http://localhost:1911/category/${categoryId}`);
  }

  // ----------------------update category by id-------------------
  updateCategoryById(categoryId:string, category:Icategory):Observable<Icategory>{
    return this.httpClient.patch<Icategory>(`http://localhost:1911/category/${categoryId}`, category, this.getHeaders());
  }

  // -------------------delete category by id-------------------
  deleteCategoryById(categoryId:string):Observable<{message:string}>{
    return this.httpClient.delete<{message:string}>(`http://localhost:1911/category/${categoryId}`, this.getHeaders());
  }
  
}

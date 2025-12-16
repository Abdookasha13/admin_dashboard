import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Iuser } from '../Models/iuser';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  private getHeaders() {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
}


  // ----------------get all users----------------
  getUsers(): Observable<Iuser[]> {
    

    return this.httpClient.get<Iuser[]>('http://localhost:1911/getAllUsers', this.getHeaders());
  }

  // ----------get user by id----------------
  getUserById(userId: string): Observable<Iuser> {
    return this.httpClient.get<Iuser>(`http://localhost:1911/getUserById/${userId}`, this.getHeaders());
  }

  // ----------------add new user----------------
  addUser(userData: Iuser): Observable<Iuser> {
    return this.httpClient.post<Iuser>('http://localhost:1911/register', userData);
  }

  // ---------------------log in admin-------------------
  loginAdmin(credentials: { email: string; password: string }): Observable<{ token: string }> {
    return this.httpClient.post<{ token: string }>(
      'http://localhost:1911/login',
      credentials
    );
  }

  // ----------------delete user----------------
  deleteUser(userId: string): Observable<{ message: string }> {
  
    return this.httpClient.delete<{ message: string }>(
      `http://localhost:1911/deleteUserById/${userId}`,
      this.getHeaders()
    );
  }

  // ----------------update user----------------
  updateUser(userId: string, userData: Iuser): Observable<Iuser> {
    return this.httpClient.patch<Iuser>(`http://localhost:1911/updateUser/${userId}`, userData , this.getHeaders());
  }
}

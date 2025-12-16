import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);

      if (decoded.role === 'admin') {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    } catch {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

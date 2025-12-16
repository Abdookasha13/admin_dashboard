import { Router } from '@angular/router';
import { UserService } from './../../Services/user-service';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  login(email: string, password: string) {
    this.userService.loginAdmin({ email, password }).subscribe({
      next: (response) => {
        const token = response.token;
        const decoded: any = jwtDecode(token);
        if (decoded.role !== 'admin') {
          this.toastr.error('You are not allowed to access the dashboard.');
          return;
        }
        localStorage.setItem('token', response.token);
        this.toastr.success('Login successful!');
        this.router.navigate(['/layout']);
      },
      error: (err) => {
        this.toastr.error('Login failed. Please check your credentials.');
      },
    });
  }
}

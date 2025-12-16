import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  openSubmenus: { [key: string]: boolean } = {
    users: false,
    categories: false,
    services: false,
    events: false,
  };

  constructor(private toastr: ToastrService, private router: Router) {}

  toggleSubmenu(menu: string) {
    const isOpen = this.openSubmenus[menu];
    for (let key in this.openSubmenus) {
      this.openSubmenus[key] = false;
    }
    this.openSubmenus[menu] = !isOpen;
  }

  logout() {
    localStorage.removeItem('token');
    this.toastr.success('Logged out successfully!');
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 500);
  }
}

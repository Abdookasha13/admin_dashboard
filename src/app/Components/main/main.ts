import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Iuser } from '../../Models/iuser';
import { UserService } from '../../Services/user-service';
import { SearchService } from '../../Services/search-service';
import { LessonsService } from '../../Services/lessons-service';
import { UsersMessagesService } from '../../Services/users-messages-service';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';
import { filter, forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements OnInit {
  adminData: Iuser = {} as Iuser;
  searchTerm: string = '';
  currentRoute: string = '';
  searchPlaceholder: string = 'Search...';
  notificationCount: number = 0;
  unreadMessages: number = 0;
  pendingLessons: number = 0;
  showNotifications: boolean = false;

  constructor(
    private userService: UserService,
    private searchService: SearchService,
    private router: Router,
    private lessonsService: LessonsService,
    private messagesService: UsersMessagesService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userService.getUserById(decodedToken.id).subscribe((user) => {
        this.adminData = user;
      });
    }

    // Load notifications
    this.loadNotifications();

    // Subscribe to notification changes
    this.lessonsService.notificationChange$.subscribe(() => {
      this.loadNotifications();
    });

    this.messagesService.notificationChange$.subscribe(() => {
      this.loadNotifications();
    });

    // Track route changes to update search placeholder
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects;
        this.updateSearchPlaceholder();
        this.clearSearch();
      });

    // Set initial placeholder
    this.currentRoute = this.router.url;
    this.updateSearchPlaceholder();
  }

  updateSearchPlaceholder() {
    if (this.currentRoute.includes('users')) {
      this.searchPlaceholder = 'Search users by name or email...';
    } else if (this.currentRoute.includes('categories')) {
      this.searchPlaceholder = 'Search categories...';
    } else if (this.currentRoute.includes('services')) {
      this.searchPlaceholder = 'Search services by title...';
    } else if (this.currentRoute.includes('events')) {
      this.searchPlaceholder = 'Search events by title or location...';
    } else {
      this.searchPlaceholder = 'Search...';
    }
  }

  onSearchChange() {
    this.searchService.setSearchTerm(this.searchTerm);
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchService.clearSearch();
  }

  loadNotifications() {
    forkJoin({
      messages: this.messagesService.getUsersMessages(),
      lessons: this.lessonsService.getPendingLessons(),
    }).subscribe({
      next: (res) => {
        this.unreadMessages = res.messages.filter((m) => !m.isRead).length;
        this.pendingLessons = res.lessons.count || 0;
        this.notificationCount = this.unreadMessages + this.pendingLessons;
      },
      error: (err) => console.error('Error loading notifications:', err),
    });
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  navigateToMessages() {
    this.showNotifications = false;
    this.router.navigate(['/layout/usersMessages']);
  }

  navigateToLessons() {
    this.showNotifications = false;
    this.router.navigate(['/layout/lessons']);
  }
}

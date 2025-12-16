import { UserService } from './../../Services/user-service';
import { SearchService } from './../../Services/search-service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Iuser } from '../../Models/iuser';
import { UserCard } from '../user-card/user-card';
import { Subscription } from 'rxjs';
import { Loader } from "../loader/loader";

@Component({
  selector: 'app-users',
  imports: [UserCard, Loader],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit, OnDestroy {
  users: Iuser[] = [];
  filteredUsers: Iuser[] = [];
  private searchSubscription?: Subscription;
  loading: boolean = true;

  constructor(
    private userService: UserService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data.filter((user) => user.role !== 'admin');
        this.filteredUsers = this.users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.loading = false;
      },
    });

    // Subscribe to search term changes
    this.searchSubscription = this.searchService.searchTerm$.subscribe((term) => {
      this.filterUsers(term);
    });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  filterUsers(searchTerm: string) {
    if (!searchTerm || searchTerm.trim() === '') {
      this.filteredUsers = this.users;
    } else {
      const term = searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.role.toLowerCase().includes(term)
      );
    }
  }

  removeUser(userId: string) {
    this.users = this.users.filter((user) => user._id !== userId);
    this.filteredUsers = this.filteredUsers.filter((user) => user._id !== userId);
  }
}

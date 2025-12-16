import { UserService } from './../../Services/user-service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Iuser } from '../../Models/iuser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-card',
  imports: [CommonModule],
  templateUrl: './user-card.html',
  styleUrl: './user-card.scss',
})
export class UserCard {
  @Input() user: Iuser = {} as Iuser;
  @Output() deleted = new EventEmitter<string>();
  isDeleteModalOpen: boolean = false;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService
  ) {}

  navigateToEdit() {
    this.router.navigate(['/layout/editUser', this.user._id]);
  }

  openDeleteModal() {
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }

  confirmDelete() {
    this.userService.deleteUser(this.user._id as string).subscribe(() => {
      this.toastr.success('User deleted successfully');
      this.deleted.emit(this.user._id as string);
      this.closeDeleteModal();
    });
  }
}

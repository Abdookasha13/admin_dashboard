import { UserService } from './../../Services/user-service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Iuser } from '../../Models/iuser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UploadImageService } from '../../Services/upload-image-service';

@Component({
  selector: 'app-add-user',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-user.html',
  styleUrl: './add-user.scss',
})
export class AddUser implements OnInit {
  user: Iuser = {role: 'student'} as Iuser;
  uploading: boolean = false;
  preview: string | ArrayBuffer | null = null;
  userId: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private uploadService: UploadImageService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe({
        next: (data) => {
          this.user = data;
          this.preview = data.profileImage;
        },
      });
    }
  }

  async uploadImage(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.preview = URL.createObjectURL(file);
    this.uploading = true;
    try {
      const url = await this.uploadService.uploadImage(file, 'user_profiles');
      this.user.profileImage = url;
      this.toastr.success('Image uploaded successfully!');
    } catch (error) {
      this.toastr.error('Failed to upload image');
    } finally {
      this.uploading = false;
    }
  }

  addUser(){
    if (this.userId) {
      this.userService.updateUser(this.userId, this.user).subscribe({
        next: () => {
          this.toastr.success('User updated successfully!');
          this.router.navigate(['/layout/users']);
        },
        error: () => {
          this.toastr.error('Failed to update user');
        },
      });
    } else {
      this.userService.addUser(this.user).subscribe({
        next: () => {
          this.toastr.success('User added successfully!');
          this.router.navigate(['/layout/users']);
        },
        error: () => {
          this.toastr.error('Failed to add user');
        },
      });
    }
  }
}

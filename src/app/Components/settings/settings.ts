import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../Services/user-service';
import { UploadImageService } from '../../Services/upload-image-service';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';
import { Iuser } from '../../Models/iuser';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, CommonModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings implements OnInit {
  adminData: Iuser = {
    name: '',
    email: '',
    password: '',
    role: 'admin',
    profileImage: '',
  };

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isUploading: boolean = false;

  constructor(
    private userService: UserService,
    private uploadImageService: UploadImageService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAdminData();
  }

  loadAdminData(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const decoded: any = jwtDecode(token);
    const adminId = decoded.userId || decoded.id;

    this.userService.getUserById(adminId).subscribe({
      next: (user) => {
        this.adminData = user;
        this.imagePreview = user.profileImage || null;
      },
      error: () => {
        this.toastr.error('Failed to load admin data.');
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async updateProfile(): Promise<void> {
    if (!this.adminData.name || !this.adminData.email) {
      this.toastr.warning('Please fill all required fields.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    const decoded: any = jwtDecode(token);
    const adminId = decoded.userId || decoded.id;

    this.isUploading = true;

    try {
      if (this.selectedFile) {
        const imageUrl = await this.uploadImageService.uploadImage(this.selectedFile, 'users');
        this.adminData.profileImage = imageUrl;
      }

      this.saveProfile(adminId);
    } catch (error) {
      this.isUploading = false;
      this.toastr.error('Failed to upload image.');
    }
  }

  saveProfile(adminId: string): void {
    const updateData: Iuser = {
      name: this.adminData.name,
      email: this.adminData.email,
      password: this.adminData.password,
      role: this.adminData.role,
      profileImage: this.adminData.profileImage,
    };

    this.userService.updateUser(adminId, updateData).subscribe({
      next: () => {
        this.isUploading = false;
        this.selectedFile = null;
        this.toastr.success('Profile updated successfully!');
        this.loadAdminData();
      },
      error: () => {
        this.isUploading = false;
        this.toastr.error('Failed to update profile.');
      },
    });
  }
}

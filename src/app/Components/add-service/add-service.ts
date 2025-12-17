import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../Services/service-service';
import { Iservice } from '../../Models/iservice';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadImageService } from '../../Services/upload-image-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-service',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-service.html',
  styleUrl: './add-service.scss',
})
export class AddService implements OnInit {
  service: Iservice = {
    icon: '',
    title: { en: '', ar: '' },
    description: { en: '', ar: '' },
  };
  serviceId: string | null = null;

  serviceIcons = [
    { value: 'bi bi-award-fill', label: 'Best Coaching', icon: 'bi bi-award-fill' },
    { value: 'bi bi-laptop-fill', label: 'Convenient Practice', icon: 'bi bi-laptop-fill' },
    { value: 'bi bi-lightbulb-fill', label: 'Creative Minds', icon: 'bi bi-lightbulb-fill' },
    { value: 'bi bi-play-circle-fill', label: 'Video Tutorials', icon: 'bi bi-play-circle-fill' },
    { value: 'bi bi-trophy-fill', label: 'Worlds Record', icon: 'bi bi-trophy-fill' },
    { value: 'bi bi-patch-check-fill', label: 'Certificates', icon: 'bi bi-patch-check-fill' },
  ];

  constructor(
    private serviceService: ServiceService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.paramMap.get('id');
    if (this.serviceId) {
      this.serviceService.getServiceById(this.serviceId).subscribe({
        next: (data) => {
          this.service = data;
        },
        error: (error) => {
          this.toastr.error('Error fetching service details');
        },
      });
    }
  }

  addService() {
    if (this.serviceId) {
      this.serviceService.updateService(this.serviceId, this.service).subscribe({
        next: (data) => {
          this.toastr.success('Service updated successfully!');
          this.router.navigate(['/layout/services']);
        },
        error: (error) => {
          this.toastr.error('Failed to update service');
        },
      });
    } else {
      this.serviceService.addService(this.service).subscribe({
        next: (data) => {
          this.toastr.success('Service added successfully!');
          this.router.navigate(['/layout/services']);
        },
        error: (error) => {
          this.toastr.error('Failed to add service');
        },
      });
    }
  }
}

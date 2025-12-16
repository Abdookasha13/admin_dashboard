import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Iservice } from '../../Models/iservice';
import { ServiceService } from '../../Services/service-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-card',
  imports: [CommonModule],
  templateUrl: './service-card.html',
  styleUrl: './service-card.scss',
})
export class ServiceCard {
  @Input() service: Iservice = {} as Iservice;
  @Output() deleted = new EventEmitter<string>();
  isDeleteModalOpen: boolean = false;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private serviceService: ServiceService
  ) {}

   navigateToEdit() {
    this.router.navigate(['/layout/editService', this.service._id]);
  }

  openDeleteModal() {
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }

  confirmDelete() {
    this.serviceService.deleteService(this.service._id as string).subscribe(() => {
      this.toastr.success('Service deleted successfully');
      this.deleted.emit(this.service._id as string);
      this.closeDeleteModal();
    });
  }
}

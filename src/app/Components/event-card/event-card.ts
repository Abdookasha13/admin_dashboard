import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ievent } from '../../Models/ievent';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EventService } from '../../Services/event-service';

@Component({
  selector: 'app-event-card',
  imports: [CommonModule, DatePipe],
  templateUrl: './event-card.html',
  styleUrl: './event-card.scss',
})
export class EventCard {
  @Input() event: Ievent = {} as Ievent;
  @Output() deleted = new EventEmitter<string>();
  isDeleteModalOpen: boolean = false;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private eventService: EventService
  ) {}

  navigateToEdit() {
    this.router.navigate(['/layout/editEvent', this.event._id]);
  }

  openDeleteModal() {
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }

  confirmDelete() {
    this.eventService.deleteEvent(this.event._id as string).subscribe(() => {
      this.toastr.success('Event deleted successfully');
      this.deleted.emit(this.event._id as string);
      this.closeDeleteModal();
    });
  }
}

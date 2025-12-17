import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ievent } from '../../Models/ievent';
import { EventService } from '../../Services/event-service';
import { UploadImageService } from '../../Services/upload-image-service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-event',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-event.html',
  styleUrl: './add-event.scss',
})
export class AddEvent implements OnInit {
  event: Ievent = {
    eventImage: '',
    title: { en: '', ar: '' },
    description: { en: '', ar: '' },
    date: '',
    startTime: '',
    endTime: '',
    location: { en: '', ar: '' },
  };
  uploading: boolean = false;
  preview: string | ArrayBuffer | null = null;
  eventId: string | null = null;

  constructor(
    private eventService: EventService,
    private uploadService: UploadImageService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    if (this.eventId) {
      this.eventService.getEventById(this.eventId).subscribe({
        next: (data) => {
          this.event = data;
          this.preview = data.eventImage;
          console.log('Loaded event for editing:', data);
        },
        error: (error) => {
          this.toastr.error('Error fetching event details');
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
      const url = await this.uploadService.uploadImage(file, 'events');
      this.event.eventImage = url;
      this.toastr.success('Image uploaded successfully!');
    } catch (error) {
      this.toastr.error('Failed to upload image');
    } finally {
      this.uploading = false;
    }
  }

  addEvent() {
    if (this.eventId) {
      this.eventService.updateEvent(this.eventId, this.event).subscribe({
        next: (response) => {
          this.toastr.success('Event updated successfully!');
          this.router.navigate(['/layout/events']);
        },
        error: (error) => {
          this.toastr.error('Error updating event');
        },
      });
    } else {
      this.eventService.addEvent(this.event).subscribe({
        next: (response) => {
          this.toastr.success('Event added successfully!');
          this.router.navigate(['/layout/events']);
        },
        error: (error) => {
          this.toastr.error('Error adding event');
        },
      });
    }
  }
}

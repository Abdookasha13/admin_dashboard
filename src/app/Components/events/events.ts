import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventService } from '../../Services/event-service';
import { Ievent } from '../../Models/ievent';
import { EventCard } from '../event-card/event-card';
import { Subscription } from 'rxjs';
import { SearchService } from '../../Services/search-service';
import { Loader } from "../loader/loader";

@Component({
  selector: 'app-events',
  imports: [EventCard, Loader],
  templateUrl: './events.html',
  styleUrl: './events.scss',
})
export class Events implements OnInit, OnDestroy {
  events: Ievent[] = [];
  filteredEvents: Ievent[] = [];
  private searchSubscription?: Subscription;
  loading: boolean = true;

  constructor(
    private eventService: EventService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.filteredEvents = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching events:', error);
        this.loading = false;
      },
    });

    this.searchSubscription = this.searchService.searchTerm$.subscribe((term) => {
      this.filterEvents(term);
    });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  filterEvents(searchTerm: string) {
    if (!searchTerm || searchTerm.trim() === '') {
      this.filteredEvents = this.events;
    } else {
      const term = searchTerm.toLowerCase();
      this.filteredEvents = this.events.filter(
        (event) =>
          event.title.toLowerCase().includes(term) || event.location.toLowerCase().includes(term)
      );
    }
  }

  removeEvent(id: string) {
    this.events = this.events.filter((e) => e._id !== id);
    this.filteredEvents = this.filteredEvents.filter((e) => e._id !== id);
  }
}

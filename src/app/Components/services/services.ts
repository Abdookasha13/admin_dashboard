import { Component, OnDestroy, OnInit } from '@angular/core';
import { Iservice } from '../../Models/iservice';
import { ServiceService } from '../../Services/service-service';
import { SearchService } from '../../Services/search-service';
import { Subscription } from 'rxjs';
import { Loader } from "../loader/loader";
import { ServiceCard } from '../service-card/service-card';

@Component({
  selector: 'app-services',
  imports: [ServiceCard, Loader],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services implements OnInit, OnDestroy {
  services: Iservice[] = [];
  filteredServices: Iservice[] = [];
  private searchSubscription?: Subscription;
  loading: boolean = true;

  constructor(
    private serviceService: ServiceService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.serviceService.getServices().subscribe({
      next: (data) => {
        this.services = data;
        this.filteredServices = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching services:', error);
        this.loading = false;
      },
    });

    this.searchSubscription = this.searchService.searchTerm$.subscribe((term) => {
      this.filterServices(term);
    });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  filterServices(searchTerm: string) {
    if (!searchTerm || searchTerm.trim() === '') {
      this.filteredServices = this.services;
    } else {
      const term = searchTerm.toLowerCase();
      this.filteredServices = this.services.filter((service) =>
        service.title.en.toLowerCase().includes(term)
      );
    }
  }

  removeService(serviceId: string) {
    this.services = this.services.filter((service) => service._id !== serviceId);
    this.filteredServices = this.filteredServices.filter((service) => service._id !== serviceId);
  }
}

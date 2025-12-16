import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Iservice } from '../Models/iservice';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  constructor(private httpClient: HttpClient) {}

  // ----------------------get all services----------------
  getServices(): Observable<Iservice[]> {
    return this.httpClient.get<Iservice[]>('http://localhost:1911/getAllServices');
  }

  // ----------------------get service by id----------------
  getServiceById(serviceId: string): Observable<Iservice> {
    return this.httpClient.get<Iservice>(`http://localhost:1911/getServiceById/${serviceId}`);
  }

  // ----------------------add new service----------------
  addService(serviceData: Iservice): Observable<Iservice> {
    return this.httpClient.post<Iservice>('http://localhost:1911/addService', serviceData);
  }

  // ----------------------delete service----------------
  deleteService(serviceId: string): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(`http://localhost:1911/deleteService/${serviceId}`);
  }

  // ----------------------update service----------------
  updateService(serviceId: string, serviceData: Iservice): Observable<Iservice> {
    return this.httpClient.patch<Iservice>(`http://localhost:1911/updateService/${serviceId}`, serviceData);
  }
}

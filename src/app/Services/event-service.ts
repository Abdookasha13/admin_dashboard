import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ievent } from '../Models/ievent';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private httpClient: HttpClient){}

  // ----------------get all events----------------
  getEvents():Observable<Ievent[]>{
    return this.httpClient.get<Ievent[]>('http://localhost:1911/getAllEvents');
  }

  // ----------get event by id----------------
  getEventById(eventId:string):Observable<Ievent>{
    return this.httpClient.get<Ievent>(`http://localhost:1911/getEventById/${eventId}`);
  }

  // ----------------add new event----------------
  addEvent(eventData:Ievent):Observable<Ievent>{
    return this.httpClient.post<Ievent>('http://localhost:1911/addEvent', eventData);
  }

  // ----------------delete event----------------
  deleteEvent(eventId:string):Observable<{message:string}>{
    return this.httpClient.delete<{message:string}>(`http://localhost:1911/deleteEvent/${eventId}`);
  }

  // ----------------update event----------------
  updateEvent(eventId:string, eventData:Ievent):Observable<Ievent>{
    return this.httpClient.patch<Ievent>(`http://localhost:1911/updateEvent/${eventId}`, eventData);
  }
}

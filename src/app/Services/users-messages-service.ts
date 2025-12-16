import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IusersMessages } from '../Models/iusers-messages';

@Injectable({
  providedIn: 'root',
})
export class UsersMessagesService {
  private notificationChange = new Subject<void>();
  notificationChange$ = this.notificationChange.asObservable();

  constructor(private httpClient: HttpClient) {}

  // ------------------get all users messages------------------
  getUsersMessages(): Observable<IusersMessages[]> {
    return this.httpClient.get<IusersMessages[]>('http://localhost:1911/getAllContactUsMessages');
  }

  // ------------------delete user message------------------
  deleteUserMessage(messageId: string): Observable<{ message: string }> {
    return this.httpClient
      .delete<{ message: string }>(`http://localhost:1911/deleteContactUsMessage/${messageId}`)
      .pipe(tap(() => this.notificationChange.next()));
  }

  // -------------------mark message as read------------------
  markMessageAsRead(messageId: string): Observable<{ message: string }> {
    return this.httpClient
      .patch<{ message: string }>(`http://localhost:1911/markAsRead/${messageId}`, {})
      .pipe(tap(() => this.notificationChange.next()));
  }
}

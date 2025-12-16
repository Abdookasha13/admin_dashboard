import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Ilesson } from '../Models/ilesson';
import { IlesonResponse } from '../Models/ileson-response';

@Injectable({
  providedIn: 'root',
})
export class LessonsService {
  private notificationChange = new Subject<void>();
  notificationChange$ = this.notificationChange.asObservable();

  constructor(private httpClient: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  // ---------------------approved lessons---------------------
  approveLesson(lessonId: string): Observable<Ilesson> {
    return this.httpClient
      .patch<Ilesson>(`http://localhost:1911/approveLesson/${lessonId}`, {}, this.getHeaders())
      .pipe(tap(() => this.notificationChange.next()));
  }

  // -----------------------------get all pending lessons-----------------------------
  getPendingLessons(): Observable<IlesonResponse> {
    return this.httpClient.get<IlesonResponse>(
      'http://localhost:1911/pendingLessons',
      this.getHeaders()
    );
  }

  // ---------------------delete lesson---------------------
  deleteLesson(lessonId: string): Observable<Ilesson> {
    return this.httpClient
      .delete<Ilesson>(`http://localhost:1911/deleteLesson/${lessonId}`, this.getHeaders())
      .pipe(tap(() => this.notificationChange.next()));
  }
}

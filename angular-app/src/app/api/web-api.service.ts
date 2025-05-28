import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class WebApiService {
  constructor(private http: HttpClient) { }

  getUserInfo1(): Observable<string> {
    return this.http.get(`${environment.apiUrl}/userInfo1`, { responseType: 'text' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error details:', error);
          if (error.error instanceof ErrorEvent) {
            console.error('Client-side error:', error.error.message);
          } else {
            console.error('Server-side error:', error.status, error.error);
          }
          return throwError(() => error);
        })
      );
  }

  updatePublicLink(newLink: string): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/profile/link`, { newLink: newLink })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error details:', error);
          if (error.error instanceof ErrorEvent) {
            console.error('Client-side error:', error.error.message);
          } else {
            console.error('Server-side error:', error.status, error.error);
          }
          return throwError(() => error);
        })
      );
  }

  updateAvatar(avatarUrl: string): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/profile/avatar`, { avatarUrl })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error updating avatar:', error);
          return throwError(() => error);
        })
      );
  }

  sendTip(tipData: { receiverLink: string; amount: number; message: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/tips`, tipData)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error sending tip:', error);
          if (error.error instanceof ErrorEvent) {
            console.error('Client-side error:', error.error.message);
          } else {
            console.error('Server-side error:', error.status, error.error);
          }
          return throwError(() => error);
        })
      );
  }

  getReceivedTips(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/tips/received`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error getting received tips:', error);
          return throwError(() => error);
        })
      );
  }

  getSentTips(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/tips/sent`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error getting sent tips:', error);
          return throwError(() => error);
        })
      );
  }

  addBalance(amount: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/profile/balance`, amount, { responseType: 'text' })
      .pipe(
        catchError(error => {
          console.error('Error adding balance:', error);
          if (error.error instanceof ErrorEvent) {
            console.error('Client-side error:', error.error.message);
          } else {
            console.error('Server-side error:', error);
          }
          return throwError(() => error);
        })
      );
  }

  searchUsers(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/users/search?query=${encodeURIComponent(query)}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error searching users:', error);
          return throwError(() => error);
        })
      );
  }
}

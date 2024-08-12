import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:3000/rezervacije';

  constructor(private http: HttpClient) {}

  getReservations(userId: string): Observable<any[]> {
    const url = `${this.apiUrl}?userId=${userId}`;
    return this.http.get<any[]>(url);
  }
  getAllReservations(): Observable<any[]> {
    const url = `${this.apiUrl}`;
    return this.http.get<any[]>(url);
  }
  deleteReservation(reservationId: string): Observable<any> {
    const url = `${this.apiUrl}/${reservationId}`;
    return this.http.delete<any>(url);
  }
}

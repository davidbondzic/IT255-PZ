import { Injectable } from '@angular/core';
import { Observable, of , map, switchMap, throwError} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap} from 'rxjs/operators';
import { Racunar } from '../racunar.model';
import { Reservation } from '../reservartion.model';

@Injectable({
  providedIn: 'root'
})
export class ComputerService {
  private apiUrl = 'http://localhost:3000/racunari';

  loadComputers(): Observable<Racunar[]> {
    return this.http.get<Racunar[]>(this.apiUrl).pipe(
      tap(computers => console.log('Učitani racunari:', computers)),
      catchError(this.handleError)
    );
  }

  reserveComputer(computerId: string, userId: string, datum: Date, brojSati: number): Observable<any> {
    const reservationData = { racunarId: computerId, userId, datum, brojSati };
  
    return this.http.get<Racunar>(`http://localhost:3000/racunari/${computerId}`).pipe(
      switchMap(racunar => {
        if (!racunar) {
          return throwError('Racunar nije pronađen.');
        }
  
        racunar.rezervisano = true;
  
        return this.http.put<any>(`http://localhost:3000/racunari/${computerId}`, racunar).pipe(
          switchMap(() => this.http.post<any>(`http://localhost:3000/rezervacije`, reservationData)),
          tap(response => console.log('Rezervacija uspešna:', response))
        );
      }),
      catchError(error => {
        console.error('Greška', error);
        return of(null);
      })
    );
  }
  
  
  

  getUserReservations(userId: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`http://localhost:3000/rezervacije?userId=${userId}`).pipe(
      tap(reservations => console.log(`Rezervacije za korisnika ${userId}:`, reservations)),
      catchError(this.handleError)
    );
  }

  getReservationsForUser(userId: string): Observable<Reservation[]> {
    const url = `http://localhost:3000/rezervacije?userId=${userId}`;
    return this.http.get<Reservation[]>(url);
  }
  
  getComputers(): Observable<Racunar[]> {
    return this.http.get<Racunar[]>(`${this.apiUrl}`).pipe(
      map(racunari => racunari.filter(computer => !computer.rezervisano)),
      catchError(this.handleError)
    );
  }

  addComputer(computer: Racunar): Observable<Racunar> {
    return this.http.post<Racunar>(this.apiUrl, computer).pipe(
      tap(newComputer => console.log('Dodat novi racunar:', newComputer)),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<any> {
    console.error('Greška:', error);
    return of(null);
  }

  constructor(private http: HttpClient) {}
}

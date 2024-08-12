import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getRacunari(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/racunari`);
  }
  dodajRacunar(noviRacunar: any): Observable<any> {
    const noviRacunarSaStatusom = { ...noviRacunar, rezervisano: false };
    return this.http.post(`${this.apiUrl}/racunari`, noviRacunarSaStatusom);
  }  
  obrisiRacunar(racunarId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/racunari/${racunarId}`);
  }
  azurirajRacunar(id: string, noviPodaci: any): Observable<any> {
    const url = `${this.apiUrl}/racunari/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.put(url, noviPodaci, { headers }).pipe(
      catchError((error) => {
        console.error('Greška', error);
        throw error;
      })
    );
  }

  getRezervacije(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rezervacije`);
  }

  getUseri(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

}

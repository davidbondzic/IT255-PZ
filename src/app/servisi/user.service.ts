import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable , of, EMPTY } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from '../user.model';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loggedIn: boolean = false;
  private userType: string = '';
  private currentUserId: string | null = null;
  private currentUser: string | null = null;

  login(userId: string): void {
    this.currentUser = userId;
  }

  logout(): void {
    this.currentUser = null;
  }

  setCurrentUser(userId: string): void {
    this.currentUser = userId;
  }

  getCurrentUserId(): string | null {
    return this.currentUser;
  }

  getCurrentUserFromUsername(username: string): Observable<User | null> {
    return this.http.get<User>(`http://localhost:3000/users?username=${username}`).pipe(
      catchError(() => of(null))
    );
  }

  getCurrentUserIdFromUsername(username: string): Observable<string | null> {
    return this.http.get<User[]>(`http://localhost:3000/users?username=${username}`).pipe(
      map(users => {
        const user = users[0];
        return user ? user.id : null;
      }),
      catchError(() => of(null))
    );
  }
  
  
  loginUser(username: string, password: string): Observable<boolean> {
    return this.validateUser(username, password).pipe(
      switchMap(isValid => {
        if (isValid) {
          return this.getUserType(username) || EMPTY; 
        } else {
          console.log('Neuspešna prijava');
          return EMPTY;
        }
      }),
      switchMap(userType => {
        if (userType) {
          return this.getCurrentUserIdFromUsername(username) || EMPTY;
        } else {
          return EMPTY;
        }
      }),
      map(userId => {
        if (userId !== null) {
          this.setLoggedIn(this.userType);
          this.setCurrentUser(userId);
          return true;
        } else {
          console.error('Korisnik nije pronađen.');
          return false;
        }
      }),
      catchError(error => {
        console.error('Greška', error);
        return EMPTY;
      })
    );
  }
  
  
  

  constructor(private http: HttpClient) {}

  validateUser(username: string, password: string): Observable<boolean> {
    return this.http.get<boolean>(`http://localhost:3000/users?username=${username}&password=${password}`);
  }

  getUserType(username: string): Observable<string> {
    return this.http.get<any[]>(`http://localhost:3000/users?username=${username}`).pipe(
      map(users => {
        const user = users[0];
        return user ? user.type : '';
      }),
      catchError(() => EMPTY) // Koristi EMPTY umesto undefined u slučaju greške
    );
  }
  
  

  registerUser(username: string, password: string): Observable<any> {
    const newUser = { username, password, type: 'user' };
    return this.http.post(`http://localhost:3000/users`, newUser);
  }

  setLoggedIn(userType: string): void {
    this.loggedIn = true;
    this.userType = userType;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}

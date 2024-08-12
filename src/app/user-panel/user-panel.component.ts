import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, switchMap, tap, of, catchError, throwError , first, map, forkJoin } from 'rxjs';
import { Racunar } from '../racunar.model';
import { ComputerService } from '../servisi/computer.service';
import { Router } from '@angular/router';
import { Reservation } from '../reservartion.model';
import { ReservationService } from '../servisi/reservation.service';
import { UserService } from '../servisi/user.service';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})
export class UserPanelComponent implements OnInit {
  availableRacunari$: Observable<Racunar[]>;
  reservationForm: FormGroup;
  selectedComputer: Racunar | null = null;
  reservationError: string | null = null;
  selectedComputerId: string | null;
  userReservations$: Observable<Reservation[]> | null = null;
  notReservedRacunari$!: Observable<Racunar[]>;
  reservationsForUser$: Observable<Reservation[]> | undefined;


  constructor(
    private computerService: ComputerService,
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.availableRacunari$ = this.computerService.getComputers();
    this.reservationForm = this.fb.group({
      selectedComputerId: [null, Validators.required],
      brojSati: [1, Validators.min(1)], 
    });
    this.selectedComputerId = null;
  }

  refreshData() {
    const userId = this.userService.getCurrentUserId();
  
    if (userId) {
      const notReservedRacunari$ = this.computerService.getComputers().pipe(
        map(racunari => racunari.filter(computer => !computer.rezervisano))
      );
  
      const reservationsForUser$ = this.computerService.getReservationsForUser(userId);
  
      forkJoin([notReservedRacunari$, reservationsForUser$]).subscribe(
        ([notReservedRacunari, reservations]) => {
          this.notReservedRacunari$ = of(notReservedRacunari);
  
          this.userReservations$ = of(reservations);
        },
        error => {
          console.error('Greška pri osvežavanju podataka:', error);
        }
      );
    } else {
      console.error('No user');
    }
  }
  
  

  ngOnInit() {
    this.refreshData();
    const userId: string | null = this.userService.getCurrentUserId();
    this.availableRacunari$ = this.computerService.getComputers();
    console.log('Current User ID:', userId);
  
    if (userId) {
      this.notReservedRacunari$ = this.computerService.getComputers().pipe(
        map(racunari => racunari.filter(computer => !computer.rezervisano))
      );
      this.userReservations$ = this.computerService.getUserReservations(userId).pipe(
        tap(reservations => console.log(`Rezervacije za korisnika ${userId}:`, reservations)),
        catchError(error => {
          console.error('Greška', error);
          return of([]);
        })
      );
    }
  }
  

  onSelectComputer(computer: Racunar): void {
    this.selectedComputer = computer;
    this.selectedComputerId = computer.id;
  }

  
  reserveComputer(): void {
    if (this.selectedComputerId) {
      const userId = this.userService.getCurrentUserId();
      function generateUniqueId(): string {
        return '_' + Math.random().toString(36).substr(2, 9);
      }
      if (userId) {
        this.availableRacunari$.pipe(
          first(),
          switchMap((racunari: Racunar[]) => {
            const selectedComputer = racunari.find((computer: Racunar) => computer.id === this.selectedComputerId);
            return selectedComputer ? of(selectedComputer) : throwError('Not found');
          })
        ).subscribe(
          selectedComputer => {
            selectedComputer.rezervisano = true;
  
            const novaRezervacija: Reservation = {
              id: generateUniqueId(),
              racunarId: this.selectedComputerId!,
              userId: userId,
              datum: new Date(),
              brojSati: this.reservationForm.value.brojSati
            };
  
            this.computerService.reserveComputer(this.selectedComputerId!, userId, new Date(), this.reservationForm.value.brojSati).subscribe(
              () => {
                console.log('Uspesno');
              },
              (error) => {
                console.error('Greška', error);
              }
            );
          },
          error => {
            console.error('Greška', error);
          }
        );
      } else {
        console.error('No user');
      }
    } else {
      this.reservationError = 'Morate izabrati racunar pre rezervacije.';
    }
  }
  
  
  getReservationsForUser(userId: string): void {
    this.computerService.getReservationsForUser(userId).subscribe(
      (reservations) => {
        console.log('Rezervacije za korisnika:', reservations);
      },
      (error) => {
        console.error('Greška', error);
      }
    );
  }
  

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}

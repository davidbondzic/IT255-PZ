import { Component, OnInit } from '@angular/core';
import { DataService } from '../servisi/data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Racunar } from '../racunar.model';
import { Reservation } from '../reservartion.model';
import { ReservationService } from '../servisi/reservation.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  racunari: any[] = [];
  users: any[] = [];
  selectedComputerId: string | null = null;
  showUpdateButton: boolean = false;
  rezervacije: Reservation[] = [];

  noviRacunar: any = {
    graficka: '',
    procesor: '',
    ram: null,
    cena_po_satu: null
  };

  constructor(private dataService: DataService , private reservationService: ReservationService) {}

  popuniFormuZaAzuriranje(racunar: Racunar): void {
    this.noviRacunar = { ...racunar };
    this.showUpdateButton = true;
    this.selectedComputerId = racunar.id;
  }
  azurirajRacunar(): void {
    if (this.selectedComputerId) {
      this.dataService.azurirajRacunar(this.selectedComputerId, this.noviRacunar).subscribe(
        (response) => {
          console.log('Uspesno', response);
        },
        (error) => {
          console.error('Greška', error);
        }
      );
    } else {
      console.error('ID nije validan');
    }
  }
  

  loadRacunari(): void {
    this.dataService.getRacunari().subscribe(
      data => {
        console.log('Racunari:', data);
        this.racunari = data;
      },
      error => {
        console.error('Greška', error);
      }
    );
  }

  dodajNoviRacunar(): void {
    this.dataService.dodajRacunar(this.noviRacunar).subscribe(
      (response) => {
        console.log('Uspesno', response);
      },
      (error) => {
        console.error('Greška', error);
      }
    );
  }

  obrisiRacunar(racunarId: string): void {
    this.dataService.obrisiRacunar(racunarId).subscribe(
      () => {
        console.log('Uspesno');
        this.loadRacunari();
      },
      error => {
        console.error('Greška', error);
      }
    );
  }

  ngOnInit(): void {
    console.log('Admin Panel Component Loaded');
    this.loadRacunari();
    this.loadReservations();
    this.loadUseri();
  }

  loadReservations(): void {
    this.reservationService.getAllReservations().subscribe(
      (reservations) => {
        this.rezervacije = reservations;
      },
      (error) => {
        console.error('Greška prilikom dobijanja rezervacija:', error);
      }
    );
  }

  deleteReservation(reservationId: string): void {
    if (confirm('Da li ste sigurni da želite obrisati ovu rezervaciju?')) {
      this.reservationService.deleteReservation(reservationId).subscribe(
        () => {
          console.log('Rezervacija uspešno obrisana.');
          this.loadReservations();
        },
        (error) => {
          console.error('Greška prilikom brisanja rezervacije:', error);
        }
      );
    }
  }



  loadUseri(): void {
    this.dataService.getUseri().subscribe(
      data => {
        console.log('Useri:', data);
        this.users = data;
      },
      error => {
        console.error('Greška', error);

      }
    );
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../servisi/user.service';

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.scss']
})
export class RegistracijaComponent {
  username: string = '';
  password: string = '';

  constructor(private userService: UserService, private router: Router) {}

  onSubmit(): void {
    this.userService.registerUser(this.username, this.password).subscribe(
      () => {
        console.log('Registracija uspešna!');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Greška prilikom registracije:', error);
      }
    );
  }
}

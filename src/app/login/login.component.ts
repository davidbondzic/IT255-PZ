import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../servisi/user.service';
import { switchMap, EMPTY, of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.userService.loginUser(username, password).subscribe(
        success => {
          if (success) {
            this.userService.getUserType(username).pipe(
              switchMap(userType => {
                if (userType) {
                  this.router.navigate([`/${userType}-panel`]);
                  return EMPTY;
                } else {
                  console.log('Neuspešna prijava - nepoznat tip korisnika');
                  return of(null);
                }
              })
            ).subscribe(
              () => {},
              userTypeError => {
                console.error('Greška prilikom dobijanja tipa korisnika:', userTypeError);
              }
            );
          } else {
            console.log('Neuspešna prijava - pogrešna šifra');
          }
        },
        error => {
          console.error('Greška prilikom prijave:', error);
        }
      );
    }
  }

  navigateToRegister(): void {
    this.router.navigate(['/registracija']);
  }
}

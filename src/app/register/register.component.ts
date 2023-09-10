/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-undef */
/* eslint-disable no-alert */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.scss', './register.component.scss'],
})
export class RegisterComponent implements OnInit {
  busy = false;
  fname = '';
  lname = '';
  phoneNo = '';
  email = '';
  password = '';
  passwordConfirmation = '';
  loginError = false;
  message = 'Error';
  private subscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    // this.subscription = this.authService.user$.subscribe((x) => {
    //   if (this.router.url === '') {
    //     const accessToken = localStorage.getItem('access-token');
    //     if (x && accessToken) {
    //       const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    //       this.router.navigate([returnUrl]);
    //     }
    //   } // If a tab shows login page, then refresh the page to reduce duplicate login
    // });
  }
  register() {
    if (
      !this.fname ||
      !this.lname ||
      !this.phoneNo ||
      !this.email ||
      !this.password
    ) {
      return;
    }
    this.busy = true;
    this.authService
      .register(this.fname, this.lname, this.phoneNo, this.email, this.password)
      .pipe(finalize(() => (this.busy = false)))
      .subscribe(
        (response) => {
          const successMessage = response.message;
          const succesStatus = response.status;
          this.message = succesStatus+":"+successMessage;
          this.router.navigateByUrl('');
        },
        (error) => {
          const errorMessage = error.error.message;
          const errorStatus = error.error.status;
    
          this.message = errorStatus+":"+errorMessage;
          this.loginError = true;
        }
      );
    //this.router.navigateByUrl('');
  }

  // ngOnDestroy(): void {
  //   this.subscription?.unsubscribe();
  // }
}

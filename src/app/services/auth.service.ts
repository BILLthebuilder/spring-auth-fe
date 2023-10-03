/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-undef */
import { EventEmitter, Injectable, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { map, tap, delay, finalize } from 'rxjs/operators';
import { ApplicationUser } from './application-user';

interface LoginResult {
  message: string;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
  @Output() email: EventEmitter<string> = new EventEmitter();
  private readonly apiUrl = `https://3.120.190.81`;
  //private timer: Subscription;
  private _user = new BehaviorSubject<ApplicationUser>(null!);
  user$: Observable<ApplicationUser> = this._user.asObservable();

  private storageEventListener(event: StorageEvent) {
    if (event.storageArea === localStorage) {
      if (event.key === 'logout-event') {
        this.logout();
      }
      if (event.key === 'login-event') {
        this.http
          .get<ApplicationUser>(`${this.apiUrl}api/users/user/profile`)
          .subscribe((x) => {
            this._user.next({
              email: x.email,
              roles: x.roles,
            });
          });
      }
    }
  }

  constructor(private router: Router, private http: HttpClient) {
    window.addEventListener('storage', this.storageEventListener.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.storageEventListener.bind(this));
  }

  login(email: string, password: string) {
    const loginUrl = `${this.apiUrl}/api/v1/users/login`;

    const body = {
      email: email,
      password: password,
    };
    return this.http.post(loginUrl, body).pipe(
      map((response: any) => {
        const token = response.token;
        localStorage.setItem('access-token', token);
        const successResponse = response.message;
        const status = response.status;

        // Update the user BehaviorSubject with the extracted values
        this._user.next({
          email: successResponse,
          roles: status,
        });

        // Store user data in local storage (optional)
        this.setUserInStorage(token);

        // Emit login status and email (optional)
        this.loggedIn.emit(true);

        return response;
      })
    );
  }

  register(
    firstName: string,
    lastName: string,
    phoneNumber: string,
    email: string,
    password: string
  ) {
    const signupUrl = `${this.apiUrl}/api/v1/users/signup`;

    const body = {
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
    };

    return this.http.post(signupUrl, body).pipe(
      map((response: any) => {
        const responseMessage = response.message;
        const status = response.status;

        // Update the user BehaviorSubject with the extracted values
        this._user.next({
          email: responseMessage,
          roles: status,
        });
        // Emit login status and email (optional)
        this.loggedIn.emit(true);

        return response;
      })
    );
  }

  setUserInStorage(x: any) {
    localStorage.setItem('user', x);
  }
  getUser() {
    return localStorage.getItem('user') && localStorage.getItem('access-token');
  }
  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }

  logout() {
    localStorage.clear();
    this._user.next(null!);
    this.router.navigate(['']);
  }
}

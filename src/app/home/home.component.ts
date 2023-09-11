import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlxService } from '../services/alx-test.service';
import { Joke } from '../services/jokesInterface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
busy: boolean = true;
  constructor(
    private authService: AuthService,
    private alxService: AlxService
  ) {}
  jokes: Joke[] = [];

  ngOnInit(): void {
    this.alxService
      .getJokes()
      .subscribe((data) => {
        this.jokes = data;
        this.busy = false;
      })
  }

}

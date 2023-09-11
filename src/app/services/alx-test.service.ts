/* eslint-disable @angular-eslint/contextual-lifecycle */
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
// eslint-disable-next-line import/no-cycle


@Injectable({
  providedIn: 'root',
})
export class AlxService implements OnInit {
  private readonly jokesUrl = 'https://official-joke-api.appspot.com/jokes/ten';

  private readonly kitsuManga = 'https://kitsu.io/api/edge/manga';

  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getJokes(): Observable<any> {
    return this.http.get<any>(this.jokesUrl);
  }

  getKitsuManga(): Observable<any> {
    return this.http.get<any>(this.kitsuManga);
  }
  
  ngOnInit(): void {}
}

import { Component, OnInit } from '@angular/core';
import { AlxService } from '../services/alx-test.service';
import { Joke } from '../services/jokesInterface';

@Component({
  selector: 'app-manga',
  templateUrl: './manga.component.html',
  styleUrls: ['../home/home.component.scss'],
})
export class MangaComponent implements OnInit {
  constructor(
    private alxService: AlxService
  ) {}
  mangas: any[] = [];

  ngOnInit(): void {
    this.alxService.getKitsuManga().subscribe((data) => {
      this.mangas = data.data;
      this.mangas.map(e => console.log("Mangas>>>>>>",e.attributes));
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { PagesService } from './pages/pages.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private pagesService: PagesService
  ) {
  }

  ngOnInit(): void {
    this.pagesService.initAllDocuments();
  }

}

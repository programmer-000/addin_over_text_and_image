import { Component } from '@angular/core';
import { ApplicationService } from '../../core/application.service';
import { PagesService } from '../../pages/pages.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  zoom$ = this.applicationService.zoom$;
  public documents: any[] | undefined;

  constructor(
    private applicationService: ApplicationService,
    private pagesService: PagesService
  ) {
  }

  zoomIn() {
    this.applicationService.zoomIn();
  }

  zoomOut() {
    this.applicationService.zoomOut();
  }

  getAllDocuments() {
    this.pagesService.allDocuments$.subscribe((data) => {
      this.documents = data;
    });
  }

  save() {
    this.getAllDocuments();
    this.pagesService.saveNotes(this.documents);
  }

  reset() {
    this.pagesService.reset();
    this.applicationService.zoom$.next(100);
  }
}

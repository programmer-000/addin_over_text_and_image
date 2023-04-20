import { Component, OnInit } from '@angular/core';
import { DocumentsInterface } from '../../shared/models/documents.interface';
import { PagesService } from '../pages.service';


@Component({
  selector: 'app-list-documents',
  templateUrl: './list-documents.component.html',
  styleUrls: ['./list-documents.component.scss']
})
export class ListDocumentsComponent implements OnInit {
  public documents: DocumentsInterface[] | undefined;

  constructor(
    private pagesService: PagesService,
  ) {
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.pagesService.allDocuments$.subscribe((data) => {
      this.documents = data;
    });
  }
}

import { Injectable } from '@angular/core';
import { DOCUMENTS } from '../shared/constants/documents';
import { DocumentsInterface } from '../shared/models/documents.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagesService {
  allDocuments: DocumentsInterface[] = [];
  public allDocuments$ = new BehaviorSubject([]);

  constructor() {
  }

  initAllDocuments(): void {
    this.allDocuments = JSON.parse(localStorage.getItem('all_documents') || '[]');
    if (!this.allDocuments.length) {
      localStorage.setItem('all_documents', JSON.stringify(DOCUMENTS));
      this.setAllDocuments();
    } else {
      this.setAllDocuments();
    }
  }

  setAllDocuments(): void {
    this.allDocuments$.next(JSON.parse(localStorage.getItem('all_documents') || '[]'));
  }

  saveNotes(documents: any[] | undefined) {
    localStorage.setItem('all_documents', JSON.stringify(documents));
    this.setAllDocuments();
  }

  reset() {
    localStorage.clear();
    this.initAllDocuments();
  }
}

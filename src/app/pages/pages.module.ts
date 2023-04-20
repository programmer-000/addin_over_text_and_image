import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { ListDocumentsComponent } from './list-documents/list-documents.component';
import { DocumentsComponent } from './documents/documents.component';
import { HeaderComponent } from '../layout/header/header.component';
import { FooterComponent } from '../layout/footer/footer.component';
import { ModalComponent } from '../layout/modal/modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { DraggableModule } from '../core/directive/draggable/draggable.module';


@NgModule({
  declarations: [
    PagesComponent,
    HeaderComponent,
    FooterComponent,
    ListDocumentsComponent,
    DocumentsComponent,
    ModalComponent

  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    DraggableModule
  ]
})
export class PagesModule { }

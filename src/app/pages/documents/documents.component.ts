import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { DocumentsInterface } from '../../shared/models/documents.interface';
import { PagesService } from '../pages.service';
import { ActivatedRoute } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ModalComponent } from '../../layout/modal/modal.component';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ApplicationService } from '../../core/application.service';
import { delay, Subscription } from 'rxjs';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})

export class DocumentsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('modal', {static: false}) modal!: ModalComponent
  @ViewChild('documentItem', {static: false}) documentItem!: ElementRef;

  public faTimes = faTimes;
  public positionX = 0;
  public positionY = 0;
  public resizePositionX: number = 0;
  public resizePositionY: number = 0;
  public documentElement: HTMLElement | null = null;
  public currentDoc: DocumentsInterface | null = null;
  public displayModal = true;
  public zoom: number = 100;
  public changeZoom = false;
  public readonly typeNote = TypeNote;
  public sub!: Subscription;
  public documents!: DocumentsInterface[];

  constructor(
    private pagesService: PagesService,
    private activateRoute: ActivatedRoute,
    private scroller: ViewportScroller,
    private applicationService: ApplicationService,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.getData();
    this.getZoom();
  }

  ngAfterViewInit(): void {
    this.scrollToElement();
  }

  scrollToElement(): void {
    const urlParams = this.activateRoute.snapshot.url;
    const selectedId = 'pageId_' + urlParams[1].path;
    setTimeout(() => {
      const el: HTMLElement | null = document.getElementById(selectedId);
      el?.scrollIntoView({behavior: 'smooth', block: 'start'});
    }, 100);
  }

  private getData() {
    this.pagesService.allDocuments$.subscribe((data) => {
      this.documents = data;
    });
  }

  private getZoom() {
    this.sub = this.applicationService.zoom$
      .pipe(
        delay(0)
      )
      .subscribe((zoom) => {
        this.zoom = zoom;
        if (this.zoom !== 100) {
          this.changeZoom = true;
        }
      })
  }

  setCoordsX(positionX: number, documentItem: HTMLElement) {
    const zoom = this.zoom;
    const multiplayer = zoom / 100;
    if (documentItem) {
      return positionX * multiplayer;
    } else {
      return;
    }
  }

  setCoordsY(positionY: number, documentItem: HTMLElement) {
    const zoom = this.zoom;
    const multiplayer = zoom / 100;
    if (documentItem) {
      return positionY * multiplayer;
    } else {
      return;
    }
  }

  addNotes(event: any, doc: any) {
    this.positionX = event.layerX
    this.positionY = event.layerY

    if (this.displayModal) {
      this.modal.open(this.positionX, this.positionY, event.currentTarget, doc);
    } else {
      return;
    }
  }

  deleteNote(doc: any, notes: any, typeNote: TypeNote) {
    this.displayModal = false;
    const currentDocId = doc.pageId;
    let replaceCurrentDoc = {...doc};

    if (typeNote === 'typeText') {
      const currentNotesText = [...doc.noteText];
      replaceCurrentDoc.noteText = currentNotesText.filter(n => n.noteTextId !== notes.noteTextId);
    } else if (typeNote === 'typeImg') {
      const currentNotesImg = [...doc.noteImg];
      replaceCurrentDoc.noteImg = currentNotesImg.filter(n => n.noteImgId !== notes.noteImgId);
    } else {
      return;
    }

    const currentDocuments = [...this.documents];
    const newListDocuments: DocumentsInterface[] = currentDocuments.map(item => {
      if (item.pageId === currentDocId) {
        return replaceCurrentDoc;
      }
      return item;
    });
    // @ts-ignore
    this.pagesService.allDocuments$.next(newListDocuments);
    this.displayModal = true;
  }

  setNewPositionNotes(event: { x: number; y: number }, notes: any, doc: any, typeNote: string) {
    const newCoordsX = Math.round(notes.coords.x + event.x);
    const newCoordsY = Math.round(notes.coords.y + event.y);

    const currentDoc = {...doc};
    const currentDocId = doc.pageId;
    const currentDocuments = [...this.documents];
    let newListDocuments: DocumentsInterface[];

    if (typeNote === 'typeText') {
      const currentNoteTextId = notes.noteTextId;
      const currenNoteText = [...currentDoc.noteText];

      const nevTextNote = {
        noteTextId: notes.noteTextId,
        text: notes.text,
        coords: {x: newCoordsX, y: newCoordsY}
      };

      currentDoc.noteText = currenNoteText.map(item => {
        if (item.noteTextId === currentNoteTextId) {
          return nevTextNote;
        }
        return item;
      });
      newListDocuments = currentDocuments.map(item => {
        if (item.pageId === currentDocId) {
          return currentDoc;
        }
        return item;
      });

    } else if (typeNote === 'typeImg') {
      const currentNoteImgId = notes.noteImgId;
      const currentNoteImg = [...currentDoc.noteImg];

      const nevImgNote = {
        noteImgId: notes.noteImgId,
        img: notes.img,
        coords: {x: newCoordsX, y: newCoordsY}
      };

      currentDoc.noteImg = currentNoteImg.map(item => {
        if (item.noteImgId === currentNoteImgId) {
          return nevImgNote;
        }
        return item;
      });
      newListDocuments = currentDocuments.map(item => {
        if (item.pageId === currentDocId) {
          return currentDoc;
        }
        return item;
      });

    } else {
      return;
    }
    // @ts-ignore
    this.pagesService.allDocuments$.next(newListDocuments);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

enum TypeNote {
  TYPE_TEXT = 'typeText',
  TYPE_IMG = 'typeImg',
}

import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { faAlignJustify, faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FormControl, Validators } from '@angular/forms';
import { DocumentsInterface } from '../../shared/models/documents.interface';
import { PagesService } from '../../pages/pages.service';
import { ApplicationService } from '../../core/application.service';
import { delay, Subscription } from 'rxjs';
import * as uuid from 'uuid';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent implements OnInit, AfterViewInit {
  @ViewChild('myModal', {static: false}) modal!: ElementRef;
  @ViewChildren('inputNotes') inputNotes!: QueryList<ElementRef>;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.calculatePosition();
  }

  constructor(
    private pagesService: PagesService,
    private applicationService: ApplicationService,
  ) {
  }

  public toggleNoteType = 'init-toggle';
  public positionX: number = 0;
  public positionY: number = 0;
  public resizePositionX: number = 0;
  public resizePositionY: number = 0;
  public documents: any;
  public documentElement: HTMLElement | null = null;
  public currentDoc: DocumentsInterface | null = null;
  public image: string | ArrayBuffer | null | undefined;
  public sub!: Subscription;

  textNotes: FormControl = new FormControl('', [Validators.required]);

  faAlignJustify = faAlignJustify;
  faImage = faImage;
  faTimes = faTimes;

  ngOnInit() {
    this.getZoom();
  }

  ngAfterViewInit() {
    this.inputNotes.changes.subscribe(() => {
      this.inputNotes?.first?.nativeElement?.focus();
    });
  }

  private getZoom() {
    this.sub = this.applicationService.zoom$
      .pipe(
        delay(0)
      )
      .subscribe((zoom) => {
        this.calculatePosition(zoom);
      })
  }

  open(positionX: number, positionY: number, documentElement: HTMLElement, doc: DocumentsInterface) {
    const zoom = this.applicationService.zoom$.getValue();
    const multiplayer = zoom / 100;

    this.documentElement = documentElement;
    this.currentDoc = doc;
    this.positionX = positionX / multiplayer;
    this.positionY = positionY / multiplayer;
    this.resizePositionX = this.positionX + this.documentElement.offsetLeft;
    this.resizePositionY = this.positionY + this.documentElement.offsetTop;

    this.calculatePosition(zoom);
    this.getAllDocuments();
  }

  close() {
    this.documentElement = null;
    this.toggleNoteType = 'init-toggle'
  }

  toggleNote(type: string) {
    if (type === 'text') {
      this.toggleNoteType = 'text';
    } else if (type === 'img') {
      this.toggleNoteType = 'img';
    }
  }

  getAllDocuments() {
    this.pagesService.allDocuments$.subscribe((data) => {
      this.documents = data;
    });
  }

  addTextNotes(): void {
    const textNotes = this.textNotes.value;
    const nevTextNoteId = uuid.v4();
    const currentDocId = this.currentDoc?.pageId;
    const currentDoc = this.documents.find((item: { pageId?: number | undefined; }) => item.pageId === currentDocId);

    const nevTextNote = {
      noteTextId: nevTextNoteId,
      text: textNotes,
      coords: {x: this.positionX, y: this.positionY}
    };

    const currenNoteText = [...currentDoc.noteText];
    currenNoteText.push(nevTextNote);

    const replaceCurrentDoc = {...currentDoc};
    replaceCurrentDoc.noteText = currenNoteText;

    const currentDocuments = [...this.documents];
    const newListDocuments: DocumentsInterface[] = currentDocuments.map(item => {
      if (item.pageId === currentDocId) {
        return replaceCurrentDoc;
      }
      return item;
    });

    // @ts-ignore
    this.pagesService.allDocuments$.next(newListDocuments);
    this.textNotes.reset();
    this.close();
  }

  addImgNotes($event: any): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    let file: File = inputValue.files[0];
    let myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.image = myReader.result;
      const imgNotes = this.image;
      const newImgNoteId = uuid.v4();
      const currentDocId = this.currentDoc?.pageId;
      const currentDoc = this.documents.find((item: { pageId?: number | undefined; }) => item.pageId === currentDocId);

      const newImgNote = {
        noteImgId: newImgNoteId,
        img: imgNotes,
        coords: {x: this.positionX, y: this.positionY}
      };

      const currenNoteImg = [...currentDoc.noteImg];
      currenNoteImg.push(newImgNote);

      const replaceCurrentDoc = {...currentDoc};
      replaceCurrentDoc.noteImg = currenNoteImg;

      const currentDocuments = [...this.documents];

      const newListDocuments: DocumentsInterface[] = currentDocuments.map(item => {
        if (item.pageId === currentDocId) {
          return replaceCurrentDoc;
        }
        return item;
      });

      // @ts-ignore
      this.pagesService.allDocuments$.next(newListDocuments);
      this.textNotes.reset();
      this.close();
    }
    myReader.readAsDataURL(file);
  }

  calculatePosition(zoom: number = 100) {
    const multiplayer = zoom / 100;
    if (this.documentElement) {
      this.resizePositionX = this.positionX * multiplayer + this.documentElement.offsetLeft;
      this.resizePositionY = this.positionY * multiplayer + this.documentElement.offsetTop;
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

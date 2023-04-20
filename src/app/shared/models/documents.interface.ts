export interface DocumentsInterface {
  pageId?: number;
  title?: string;
  urlImg?: string;
  noteText?: TypeTextInterface[];
  noteImg?: TypeImgInterface[];
}

export interface TypeTextInterface {
  noteTextId?: number;
  text?: string;
  coords?: { x: any, y: any };
}

export interface TypeImgInterface {
  noteImgId?: number;
  img?: any;
  coords?: { x: any, y: any };
}

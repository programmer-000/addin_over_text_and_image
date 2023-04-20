import { DocumentsInterface } from '../models/documents.interface';
import { IMGDATA_3 } from './image_3';
import { IMGDATA_2 } from './image_2';
import { IMGDATA_1 } from './image_1';

export const DOCUMENTS: DocumentsInterface[] = [
  {
    pageId: 1,
    title: 'Document',
    urlImg: 'assets/images/doc-viewer/1.png',
    noteText: [
      {
        noteTextId: 1,
        text: ' test 1 test',
        coords: {x: 50, y: 150}
      },
      {
        noteTextId: 2,
        text: '22 test 22 test',
        coords: {x: 300, y: 280}
      }
    ],
    noteImg: [
      {
        noteImgId: 1,
        img: IMGDATA_1,
        coords: {x: 577, y: 359}
      }
    ]
  },
  {
    pageId: 2,
    title: 'Document',
    urlImg: 'assets/images/doc-viewer/2.png',
    noteText: [
      {
        noteTextId: 1,
        text: 'test test',
        coords: {x: 90, y: 400}
      }
    ],
    noteImg: [
      {
        noteImgId: 1,
        img: IMGDATA_2,
        coords: {x: 503, y: 106}
      }
    ]
  },
  {
    pageId: 3,
    title: 'Document',
    urlImg: 'assets/images/doc-viewer/3.png',
    noteText: [
      {
        noteTextId: 1,
        text: '333333',
        coords: {x: 340, y: 400}
      }
    ],
    noteImg: [
      {
        noteImgId: 1,
        img: IMGDATA_3,
        coords: {x: 540, y: 100}
      }
    ]
  },
  {
    pageId: 4,
    title: 'Document',
    urlImg: 'assets/images/doc-viewer/4.png',
    noteText: [],
    noteImg: []
  }, {
    pageId: 5,
    title: 'Document',
    urlImg: 'assets/images/doc-viewer/5.png',
    noteText: [],
    noteImg: []
  }
];

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  zoom$ = new BehaviorSubject<number>(100);

  zoomIn() {
    this.setZoom(10)
  }

  zoomOut() {
    this.setZoom(-10)
  }

  setZoom(value: number) {
    let zoom = this.zoom$.getValue() + value;
    zoom = Math.max(10, zoom);
    zoom = Math.min(100, zoom);
    this.zoom$.next(zoom);
  }
}

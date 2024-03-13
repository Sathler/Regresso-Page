import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<any>();
  toastState = this.toastSubject.asObservable();

  constructor() {}

  showToast(title: string, message: string) {
    this.toastSubject.next({ title, message });
  }
}

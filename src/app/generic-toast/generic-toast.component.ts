import { Component, OnInit } from '@angular/core';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-generic-toast',
  templateUrl: './generic-toast.component.html',
  styleUrls: ['./generic-toast.component.scss']
})
export class GenericToastComponent implements OnInit {
  toastVisible: boolean = false;
  toastTitle: string = '';
  toastMessage: string = '';

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toastState.subscribe(({ title, message }) => {
      this.showToast(title, message);
    });
  }

  showToast(title: string, message: string, duration: number = 50000, type: string = "error") {
    this.toastVisible = true;
    this.toastMessage = message;

    setTimeout(() => {
      this.hideToast();
    }, duration)
  }

  hideToast(){
    this.toastVisible = false;
  }
}
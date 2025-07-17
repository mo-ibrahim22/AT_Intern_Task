import { Injectable, signal } from '@angular/core';
import { Toast } from '../models/toast.model';
@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private _toasts = signal<Toast[]>([]);
  public toasts = this._toasts.asReadonly();

  private nextId = 0;

  show(message: string, type: Toast['type'] = 'info', duration: number = 3000) {
    const id = this.nextId++;
    const toast: Toast = { id, message, type, duration };

    this._toasts.update((toasts) => [...toasts, toast]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  dismiss(id: number) {
    this._toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }

  clearAll() {
    this._toasts.set([]);
  }
}

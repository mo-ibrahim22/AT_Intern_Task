import { Injectable, signal } from '@angular/core';
import { ConfirmationConfig } from '../models/confirmation.model';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  private _isOpen = signal(false);
  private _config = signal<ConfirmationConfig | null>(null);
  private _resolveFn: ((value: boolean) => void) | null = null;

  public isOpen = this._isOpen.asReadonly();
  public config = this._config.asReadonly();

  confirm(config: ConfirmationConfig, callback: (confirmed: boolean) => void): void {
    this._config.set(config);
    this._isOpen.set(true);
    this._resolveFn = callback;
  }

  handleResponse(confirmed: boolean): void {
    if (this._resolveFn) {
      this._resolveFn(confirmed);
      this._resolveFn = null;
    }
    this._isOpen.set(false);
    this._config.set(null);
  }
}
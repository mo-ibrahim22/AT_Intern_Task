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

  async confirm(config: ConfirmationConfig): Promise<boolean> {
    this._config.set(config);
    this._isOpen.set(true);

    return new Promise<boolean>((resolve) => {
      this._resolveFn = resolve;
    });
  }

  handleResponse(confirmed: boolean) {
    if (this._resolveFn) {
      this._resolveFn(confirmed);
      this._resolveFn = null;
    }
    this._isOpen.set(false);
    this._config.set(null);
  }
}

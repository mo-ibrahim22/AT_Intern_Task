import { Injectable, signal, TemplateRef } from '@angular/core';
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

  confirm(
    config: ConfirmationConfig,
    callback: (confirmed: boolean) => void
  ): void {
    this._config.set(config);
    this._isOpen.set(true);
    this._resolveFn = callback;
  }

  confirmWithTemplate(
    title: string,
    template: TemplateRef<any>,
    callback: (confirmed: boolean) => void,
    options?: {
      confirmText?: string;
      cancelText?: string;
      data?: any;
    }
  ): void {
    const config: ConfirmationConfig = {
      title,
      customTemplate: template,
      confirmText: options?.confirmText || 'Confirm',
      cancelText: options?.cancelText || 'Cancel',
      data: options?.data,
    };

    this.confirm(config, callback);
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

import { TemplateRef } from '@angular/core';

export interface ConfirmationConfig {
  title: string;
  message?: string;
  customTemplate?: TemplateRef<unknown>;
  confirmText?: string;
  cancelText?: string;
  data?: unknown; // Additional data to pass to the template
}

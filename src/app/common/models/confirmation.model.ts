import { TemplateRef } from '@angular/core';

export interface ConfirmationConfig {
  title: string;
  message?: string;
  customTemplate?: TemplateRef<any>;
  confirmText?: string;
  cancelText?: string;
  data?: any; // Additional data to pass to the template
}

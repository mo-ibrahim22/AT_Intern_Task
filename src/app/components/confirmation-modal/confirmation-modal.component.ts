import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { ConfirmationConfig } from '../../common/models/confirmation.model';
import { ClickOutsideDirective } from '../../common/directives/click-outside.directive';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ClickOutsideDirective],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.css',
})
export class ConfirmationModalComponent {
  isOpen = input.required<boolean>();
  config = input<ConfirmationConfig | null>(null);

  response = output<boolean>();

  onResponse(confirmed: boolean): void {
    this.response.emit(confirmed);
  }

  hasCustomTemplate(): boolean {
    return !!this.config()?.customTemplate;
  }

  getTemplateContext(): any {
    return {
      $implicit: this.config()?.data,
      data: this.config()?.data,
    };
  }
}

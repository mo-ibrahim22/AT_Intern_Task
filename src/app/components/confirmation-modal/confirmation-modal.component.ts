import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationConfig } from '../../common/models/confirmation.model';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
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
}

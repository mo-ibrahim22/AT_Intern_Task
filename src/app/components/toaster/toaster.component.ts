import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { Toast } from '../../common/models/toast.model';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.css',
})
export class ToasterComponent {
  toasts = input.required<Toast[]>();

  dismiss = output<number>();

  onDismiss(id: number): void {
    this.dismiss.emit(id);
  }
}

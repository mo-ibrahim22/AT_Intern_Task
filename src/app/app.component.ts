import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { AuthService } from './common/services/auth.service';
import { CartService } from './common/services/cart.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'AT_Intern_Task';
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  constructor() {
    effect(() => {
      const requireAuth = this.authService.isAuthenticated();
      if (requireAuth) {
        this.cartService.initializeCart();
      }
    });
  }
}

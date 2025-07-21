import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { NavigationItemLinkComponent } from '../navigation-item-link/navigation-item-link.component';
import { NavItem } from '../../common/models/navigation.model';
import { User } from '../../common/models/user.model';
import { CartService } from '../../common/services/cart.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonComponent,
    NavigationItemLinkComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  navItems = input.required<NavItem[]>();
  user = input<User | null>(null);

  private cartService = inject(CartService);
  cartCount = this.cartService.cartCount;

  toggleMobileSidebar = output<void>();
  logout = output<void>();

  onToggleMobileSidebar(): void {
    this.toggleMobileSidebar.emit();
  }

  onLogout(): void {
    this.logout.emit();
  }
}

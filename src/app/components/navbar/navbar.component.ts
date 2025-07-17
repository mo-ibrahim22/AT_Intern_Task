import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { NavItem } from '../../common/models/navigation.model';
import { User } from '../../common/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  navItems = input.required<NavItem[]>();
  user = input<User | null>(null);

  toggleMobileSidebar = output<void>();
  logout = output<void>();

  onToggleMobileSidebar(): void {
    this.toggleMobileSidebar.emit();
  }

  onLogout(): void {
    this.logout.emit();
  }
}

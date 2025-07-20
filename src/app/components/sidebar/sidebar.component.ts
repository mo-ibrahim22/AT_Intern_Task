import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { NavigationItemLinkComponent } from '../navigation-item-link/navigation-item-link.component';
import { NavItem } from '../../common/models/navigation.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonComponent,
    NavigationItemLinkComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  navItems = input.required<NavItem[]>();
  isMobileSidebarOpen = input.required<boolean>();

  toggleMobileSidebar = output<void>();

  onToggleMobileSidebar(): void {
    this.toggleMobileSidebar.emit();
  }
}

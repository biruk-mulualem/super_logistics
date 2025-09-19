import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

EventEmitter;
@Component({
  selector: 'app-header',
  imports: [CommonModule,RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  isSidebarOpen = false;
  isUserDropdownOpen = false;

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }
  // Dropdown state
  dropdowns: { [key: string]: boolean } = {
    history: false,
    report: false,
  };

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;

    // Close all dropdowns
    for (const key in this.dropdowns) {
      this.dropdowns[key] = false;
    }
  }

  toggleDropdown(name: string) {
    this.dropdowns[name] = !this.dropdowns[name];
  }

  // Click outside to close sidebar
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.menu-toggle');

    if (
      this.isSidebarOpen &&
      sidebar &&
      toggleBtn &&
      !sidebar.contains(target) &&
      !toggleBtn.contains(target)
    ) {
      this.closeSidebar();
    }
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    imports: [CommonModule,RouterLink],
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {
  activeIndex = 0;
  isCollapsed = false;

  setActive(index: number) {
    this.activeIndex = index;
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}



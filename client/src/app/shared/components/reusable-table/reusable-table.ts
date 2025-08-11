import { Component, Input, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { isPlatformBrowser } from '@angular/common';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-reusable-table',
  templateUrl: './reusable-table.html',
  styleUrls: ['./reusable-table.css']
})
export class ReusableTable implements OnInit {
  @Input() headers: string[] = [];
  @Input() data: any[] = [];

  filteredData: any[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  rowsPerPage: number = 10;

  private originalRowData = new Map<any, any>();

  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.filteredData = [...this.data];

    if (this.isBrowser) {
      this.setRowsPerPageBasedOnWidth(window.innerWidth);
    } else {
      this.rowsPerPage = 10;  // default for SSR
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (this.isBrowser) {
      this.setRowsPerPageBasedOnWidth(event.target.innerWidth);
    }
  }

private setRowsPerPageBasedOnWidth(width: number) {
  if (width <= 480) {
    this.rowsPerPage = 1;      // phones: 1 row per page
  } else {
    this.rowsPerPage = 10;     // larger devices: 10 rows per page
  }
  this.currentPage = 1;        // always reset to page 1
}



  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.filteredData.slice(start, start + this.rowsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.rowsPerPage);
  }

  onSearch(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredData = this.data.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(query)
      )
    );
    this.currentPage = 1;
  }

  setPage(page: number): void {
    this.currentPage = page;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  editRow(row: any): void {
    this.originalRowData.set(row, { ...row });
    row.isEditing = true;
  }

  cancelEdit(row: any): void {
    const original = this.originalRowData.get(row);
    if (original) {
      Object.assign(row, original);
    }
    row.isEditing = false;
    this.originalRowData.delete(row);
  }

  saveRow(row: any): void {
    // Add backend update calls here if needed
    row.isEditing = false;
    this.originalRowData.delete(row);
  }

  deleteRow(row: any): void {
    this.data = this.data.filter(r => r !== row);
    this.onSearch();

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  addRow(): void {
    const newRow: any = {};
    this.headers.forEach(header => {
      newRow[header.toLowerCase()] = '';
    });
    newRow.isEditing = true;

    this.data.unshift(newRow);
    this.filteredData = [...this.data];
    this.currentPage = 1;
  }
}

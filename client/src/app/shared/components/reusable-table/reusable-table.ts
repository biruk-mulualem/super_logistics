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

  isBrowser: boolean;

  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;

  addData: any = {};
  editData: any = {};
  deleteRowData: any = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.filteredData = [...this.data];

    if (this.isBrowser) {
      this.setRowsPerPageBasedOnWidth(window.innerWidth);
    } else {
      this.rowsPerPage = 10;
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
      this.rowsPerPage = 1;
    } else {
      this.rowsPerPage = 10;
    }
    this.currentPage = 1;
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

  // --- Modal handling with body scroll toggle ---

  private toggleBodyScroll(disable: boolean) {
    if (!this.isBrowser) return;
    if (disable) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }

  openAddModal(): void {
    this.addData = {};
    this.headers.forEach(header => {
      this.addData[header.toLowerCase()] = '';
    });
    this.showAddModal = true;
    this.toggleBodyScroll(true);
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.toggleBodyScroll(false);
  }

  saveAdd(): void {
    this.addData.id = this.generateId();
    this.data.unshift(this.addData);
    this.applyFilterAndPagination();
    this.closeAddModal();
  }

  openEditModal(row: any): void {
    this.editData = { ...row };
    this.showEditModal = true;
    this.toggleBodyScroll(true);
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.toggleBodyScroll(false);
  }

  saveEdit(): void {
    const index = this.data.findIndex(r => r.id === this.editData.id);
    if (index > -1) {
      this.data[index] = this.editData;
    }
    this.applyFilterAndPagination();
    this.closeEditModal();
  }

  openDeleteModal(row: any): void {
    this.deleteRowData = row;
    this.showDeleteModal = true;
    this.toggleBodyScroll(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.deleteRowData = null;
    this.toggleBodyScroll(false);
  }

  confirmDelete(): void {
    this.data = this.data.filter(r => r !== this.deleteRowData);
    this.applyFilterAndPagination();
    this.closeDeleteModal();
  }

  private applyFilterAndPagination() {
    this.onSearch();
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  private generateId(): number {
    return Math.floor(Math.random() * 1000000);
  }
}

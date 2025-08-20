import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  HostListener,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { IntransitFollowupService } from '../../../services/intransit-followup.service';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-reusable-table',
  templateUrl: './reusable-table.html',
  styleUrls: ['./reusable-table.css'],
})
export class ReusableTable implements OnInit, OnChanges {
  @Input() headers: { label: string; key: string }[] = [];
  @Input() data: any[] = [];

  @Output() add = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  filteredData: any[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  rowsPerPage: number = 13;

  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;
  showDetailModal = false;

  addData: any = {};
  editData: any = {};
  deleteRowData: any = null;
  selectedRow: any = null;

  isBrowser: boolean;
  pageType: 'logistics' | 'intransit' | 'reports' | 'history' | null = null;
  buttonVisibility = { add: true, edit: true, delete: true, detail: true };

  routeConfigs: {
    match: string;
    pageType: 'logistics' | 'intransit' | 'reports' | 'history';
    add?: boolean;
    edit?: boolean;
    delete?: boolean;
    detail?: boolean;
  }[] = [
    { match: '/intransit', pageType: 'intransit', add: true, edit: true, delete: true, detail: true },
    { match: '/logistics', pageType: 'logistics', add: false, edit: true, delete: true, detail: true },
    { match: '/reports', pageType: 'reports', add: false, edit: true, delete: false, detail: true },
    { match: '/history', pageType: 'history', add: false, edit: false, delete: false, detail: true },
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public router: Router,
    public intransitService: IntransitFollowupService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.updatePageTypeAndButtons();
    });
  }

  ngOnInit(): void {
    this.filteredData = [...this.data];
    if (this.isBrowser) this.setRowsPerPage(window.innerWidth);
    this.applyFilterAndPagination();
    this.updatePageTypeAndButtons();
  }

  ngOnChanges(): void {
    this.applyFilterAndPagination();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (this.isBrowser) this.setRowsPerPage(event.target.innerWidth);
  }

  private setRowsPerPage(width: number) {
    this.rowsPerPage = width <= 480 ? 1 : 13;
    this.currentPage = 1;
  }

  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.filteredData.slice(start, start + this.rowsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.rowsPerPage);
  }

  setPage(page: number) { this.currentPage = page; }
  prevPage() { if (this.currentPage > 1) this.currentPage--; }
  nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; }

  onSearch(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredData = this.data.filter(row =>
      Object.values(row).some(val => String(val).toLowerCase().includes(query))
    );
    this.currentPage = 1;
  }

  private applyFilterAndPagination() {
    this.onSearch();
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages || 1;
  }

  private updatePageTypeAndButtons() {
    const currentRoute = this.router.url;
    const config = this.routeConfigs.find(cfg => currentRoute.includes(cfg.match));
    if (config) {
      this.pageType = config.pageType;
      this.buttonVisibility.add = config.add ?? false;
      this.buttonVisibility.edit = config.edit ?? false;
      this.buttonVisibility.delete = config.delete ?? false;
      this.buttonVisibility.detail = config.detail ?? false;
    } else {
      this.pageType = null;
      this.buttonVisibility = { add: true, edit: true, delete: true, detail: true };
    }
  }

  private toggleBodyScroll(disable: boolean) {
    if (!this.isBrowser) return;
    document.body.classList.toggle('modal-open', disable);
  }

  // =======================
  // --- Add Modal ---
  // =======================
  openAddModal(): void {
    this.addData = {
      purchaseDate: '',
      purchaseOrder: '',
      purchaseCompany: '',
      contactPerson: '',
      paidFrom: '',
      origin: '',
      remark: '',
      items: [{ itemDescription: '', quantity: '', unitPrice: '', uom: '' }]
    };
    this.showAddModal = true;
    this.toggleBodyScroll(true);
  }

  addItemRow(): void {
    this.addData.items.push({ itemDescription: '', quantity: '', unitPrice: '', uom: '' });
  }

  removeItem(index: number): void {
    if (index === 0) return;
    this.addData.items.splice(index, 1);
  }


  saveAddClick(): void {
  this.add.emit(this.addData);
  this.closeAddModal();
}

  closeAddModal(): void {
    this.showAddModal = false;
    this.toggleBodyScroll(false);
  }

  // =======================
  // --- Edit Modal ---
  // =======================
  openEditModal(row: any): void {
    this.editData = JSON.parse(JSON.stringify(row));
    this.showEditModal = true;
    this.toggleBodyScroll(true);
  }

  addEditItem(): void {
    this.editData.items.push({ itemDescription: '', quantity: '', unitPrice: '', uom: '' });
  }

  removeEditItem(index: number): void {
    if (index === 0) return;
    this.editData.items.splice(index, 1);
  }
  
  saveEditClick(): void {
  this.edit.emit(this.editData);  // emit payload to parent
  this.closeEditModal();
}
  closeEditModal(): void {
    this.showEditModal = false;
    this.toggleBodyScroll(false);
  }

  // =======================
  // --- Delete Modal ---
  // =======================
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

  confirmDeleteClick(): void {
    this.delete.emit(this.deleteRowData);
    this.closeDeleteModal();
  }

  // =======================
  // --- Detail Modal ---
  // =======================
  openDetailModal(row: any): void {
    this.selectedRow = row;
    this.showDetailModal = true;
    this.toggleBodyScroll(true);
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedRow = null;
    this.toggleBodyScroll(false);
  }
}

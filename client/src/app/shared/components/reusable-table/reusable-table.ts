import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  HostListener,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef
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
  @Input() detailRow: any;        
  @Input() paymentTerms: any[] = [];  

  @Output() add = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() addPayment = new EventEmitter<any>();
@Input() editData: any = {};
@Input() showEditModal: boolean = false;

  filteredData: any[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  rowsPerPage: number = 13;
  newPayments: any[] = [];


  showAddModal = false;
  // showEditModal = false;
  showDeleteModal = false;
  showDetailModal = false;
  showPaymentModal = false;

  addData: any = {};
  // editData: any = {};
  deleteRowData: any = null;
  selectedRow: any = null;
  selectedRowForPayment: any = null;

  isBrowser: boolean;
   pageType: 'logistics' | 'intransit' | 'reports' | 'donelogisticshistory' |'doneintransithistory' |'cancelledintransithistory' |'cancelledlogisticshistory' | null = null;
 
  // pageType: 'logistics' | 'intransit' | 'reports' | 'history' | null = null;
  buttonVisibility = { add: true, edit: true, delete: true, detail: true, payment: true };
  routeConfigs = [
    { match: '/intransit', pageType: 'intransit', add: true, edit: true, delete: true, detail: true, payment: true },
    { match: '/logistics', pageType: 'logistics', add: false, edit: true, delete: true, detail: true, payment: false },
    { match: '/reports', pageType: 'reports', add: false, edit: true, delete: false, detail: true, payment: false },
    { match: '/history', pageType: 'history', add: false, edit: false, delete: false, detail: true, payment: false },
    { match: '/donelogistics', pageType: 'donelogisticshistory', add: false, edit: false, delete: false, detail: true, payment: false },
    { match: '/doneintransit', pageType: 'doneintransithistory', add: false, edit: false, delete: false, detail: true, payment: false },
    { match: '/cancelledintransit', pageType: 'cancelledintransithistory', add: false, edit: false, delete: false, detail: true, payment: false },
    { match: '/cancelledlogistics', pageType: 'cancelledlogisticshistory', add: false, edit: false, delete: false, detail: true, payment: false },
 
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public router: Router,
    public intransitService: IntransitFollowupService,
    private cdr: ChangeDetectorRef
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

  ngOnChanges(changes: SimpleChanges): void {
    this.applyFilterAndPagination();

    // Automatically open Detail modal when parent sets detailRow
    if (changes['detailRow'] && this.detailRow) {
      this.selectedRow = this.detailRow;
      this.showDetailModal = true;
      this.toggleBodyScroll(true);
      this.fetchPayments(this.detailRow.transactionId);
    }
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
      this.pageType = config.pageType as 'logistics' | 'intransit' | 'reports' | 'donelogisticshistory' |'doneintransithistory' |'cancelledintransithistory' |'cancelledlogisticshistory';
      
      this.buttonVisibility.add = config.add ?? false;
      this.buttonVisibility.edit = config.edit ?? false;
      this.buttonVisibility.delete = config.delete ?? false;
      this.buttonVisibility.detail = config.detail ?? false;
      this.buttonVisibility.payment = config.payment ?? false;
    } else {
      this.pageType = null;
      this.buttonVisibility = { add: true, edit: true, delete: true, detail: true, payment: false };
    }
  }

  private toggleBodyScroll(disable: boolean) {
    if (!this.isBrowser) return;
    document.body.classList.toggle('modal-open', disable);
  }

  // =======================
  // --- Payment Fetch ---
  // =======================
  private fetchPayments(transactionId: string): void {
    this.intransitService.getPaymentData(transactionId).subscribe({
      next: (payments) => {
        this.paymentTerms = payments.length
          ? payments
          : [{ amountPaid: '', paidBy: '', accountPaidFrom: '', paidDate: '' }];
        this.cdr.detectChanges();
      },
      error: () => {
        this.paymentTerms = [{ amountPaid: '', paidBy: '', accountPaidFrom: '', paidDate: '' }];
        this.cdr.detectChanges();
      }
    });
  }




  // =======================
  // --- Generic Add/Remove ---
  // =======================
  private addRow(targetArray: any[], template: any) {
    targetArray.push({ ...template });
  }

  private removeRow(targetArray: any[], index: number, keepAtLeastOne = true) {
    if (keepAtLeastOne && targetArray.length === 1) return;
    targetArray.splice(index, 1);
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

  addItemRow(): void { this.addRow(this.addData.items, { itemDescription: '', quantity: '', unitPrice: '', uom: '' }); }
  removeItem(index: number): void { this.removeRow(this.addData.items, index); }

saveAddClick(): void {
  // Validate main fields
  if (!this.addData.purchaseOrder?.trim() ||
      !this.addData.purchaseDate ||
      !this.addData.origin?.trim() ||
      !this.addData.purchaseCompany?.trim() ||
      !this.addData.contactPerson?.trim()) {
    alert('Please fill out all required fields before saving.');
    return;
  }

  // Validate each item row
  for (let i = 0; i < this.addData.items.length; i++) {
    const item = this.addData.items[i];
    if (!item.itemDescription?.trim() ||
        !item.uom?.trim() ||
        item.quantity === null || item.quantity === undefined || item.quantity === '' ||
        item.unitPrice === null || item.unitPrice === undefined || item.unitPrice === '') {
      alert(`Please fill out all required fields for item #${i + 1}.`);
      return;
    }
  }

  // All fields valid → emit
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

  addEditItem(): void { this.addRow(this.editData.items, { itemDescription: '', quantity: '', unitPrice: '', uom: '' }); }
  removeEditItem(index: number): void { this.removeRow(this.editData.items, index); }

saveEditClick(): void {
  this.edit.emit(this.editData); // editData must contain items and payments
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

  // Fetch payments after modal opens
  setTimeout(() => {
    this.intransitService.getPaymentData(row.transactionId).subscribe({
      next: (payments) => {
        this.paymentTerms = payments.length ? payments : [{amountPaid:'', paidBy:'', accountPaidFrom:'', paidDate:''}];
        this.cdr.detectChanges();
      },
      error: () => {
        this.paymentTerms = [{amountPaid:'', paidBy:'', accountPaidFrom:'', paidDate:''}];
        this.cdr.detectChanges();
      }
    });
  }, 0);
}

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedRow = null;
    this.paymentTerms = [];
    this.toggleBodyScroll(false);
  }

  // =======================
  // --- Payment Modal ---
  // =======================
openPaymentModal(row: any): void {
  this.selectedRowForPayment = row;
  this.newPayments = [{ amountPaid: '', paidBy: '', accountPaidFrom: '', paidDate: '' }]; // always start fresh
  this.showPaymentModal = true;
  this.toggleBodyScroll(true);
}


addPaymentRow(): void { this.addRow(this.newPayments, { amountPaid: '', paidBy: '', accountPaidFrom: '', paidDate: '' }); }
removePaymentRow(index: number): void { this.removeRow(this.newPayments, index, false); }

submitPayments(): void {
  // Validate all payment rows
  for (let payment of this.newPayments) {
    if (
      payment.amountPaid === null || payment.amountPaid === undefined || payment.amountPaid === '' ||
      !payment.paidBy?.trim() ||
      !payment.accountPaidFrom?.trim() ||
      !payment.paidDate
    ) {
      alert('Please fill out all required fields before saving.');
      return; // stop submission
    }
  }

  // All fields valid → emit payload
  const payload = {
    transactionId: this.selectedRowForPayment?.transactionId,
    payments: this.newPayments
  };
  this.addPayment.emit(payload);
  this.closePaymentModal();
}


  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.selectedRowForPayment = null;
    this.newPayments = [];
    this.toggleBodyScroll(false);
  }
}

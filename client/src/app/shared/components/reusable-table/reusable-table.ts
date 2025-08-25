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
  ChangeDetectorRef,
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
  // ============================================================
  // ---------------------- Inputs / Outputs -------------------
  // ============================================================
  @Input() headers: { label: string; key: string }[] = [];
  @Input() data: any[] = [];
  @Input() detailRow: any;
  @Input() paymentTerms: any[] = [];
  @Input() editData: any = {};
  @Input() showEditModal: boolean = false;
@Input() intransitOptions: any[] = []; // all TransactionIds + Items

  @Output() add = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() addPayment = new EventEmitter<any>();
  @Output() transactionChange = new EventEmitter<any>(); // emits when transaction is selected
@Output() itemChange = new EventEmitter<any>();        // emits when item is selected
@Output() addItemEvent = new EventEmitter<void>();     // add a new item row
@Output() removeItemEvent = new EventEmitter<number>(); // remove item row by index
@Output() intransitOptionsChange = new EventEmitter<any[]>();

// Inside ReusableTable component /logistics related codes
@Output() logisticsAdd = new EventEmitter<any>();
@Output() logisticsRemove = new EventEmitter<any>();

updateIntransitOptions(newOptions: any[]) {
  this.intransitOptionsChange.emit(newOptions);
}

  // ============================================================
  // ---------------- Table & Pagination -----------------------
  // ============================================================
  filteredData: any[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  rowsPerPage: number = 13;

  // ============================================================
  // ---------------------- Modals -----------------------------
  // ============================================================
  showModal = {
    add: false,
    edit: false,
    delete: false,
    detail: false,
    payment: false,
    main: false,
  };

  selectedRow: any = null;   // unified selected row
  newPayments: any[] = [];
  addData: any = {};
  deleteRowData: any = null;
  activeTab: string = 'detail'; // main modal default tab

  // ============================================================
  // ------------------------ Constants ------------------------
  // ============================================================
  uoms: string[] = [
    'mg', 'g', 'kg', 'ton', 'lb', 'oz', 'ml', 'l', 'pcs', 'box', 'roll', 'pack',
    'dozen', 'set', 'bottle', 'can', 'bag', 'sheet', 'meter', 'cm', 'inch',
    'yard', 'sqft', 'sqm', 'gallon', 'quart', 'pint', 'fluid_oz', 'tube',
    'carton', 'crate', 'pail', 'jar', 'packaging_unit', 'bundle', 'lot', 'pair',
    'reel', 'sheet_metal', 'roll_fabric', 'drum'
  ];

  origins: string[] = [
    'china', 'india', 'usa', 'germany', 'japan', 'south_korea', 'france', 'uk',
    'italy', 'canada', 'mexico', 'brazil', 'russia', 'turkey', 'australia',
    'singapore', 'netherlands', 'belgium', 'switzerland', 'uae', 'thailand',
    'vietnam', 'malaysia', 'indonesia'
  ];

  isBrowser: boolean;
  pageType: string | null = null;
  buttonVisibility = {
    add: true,
    edit: true,
    delete: true,
    detail: true,
    payment: true,
  };

  routeConfigs = [
    { match: '/intransit', pageType: 'intransit', add: true, edit: true, delete: true, detail: true, payment: true },
    { match: '/logistics', pageType: 'logistics', add: true, edit: true, delete: true, detail: true, payment: false },
    { match: '/reports', pageType: 'reports', add: false, edit: true, delete: false, detail: true, payment: false },
    { match: '/history', pageType: 'history', add: false, edit: false, delete: false, detail: true, payment: false },
    { match: '/donelogistics', pageType: 'donelogisticshistory', add: false, edit: false, delete: false, detail: true, payment: false },
    { match: '/doneintransit', pageType: 'doneintransithistory', add: false, edit: false, delete: false, detail: true, payment: false },
    { match: '/cancelledintransit', pageType: 'cancelledintransithistory', add: false, edit: false, delete: false, detail: true, payment: false },
    { match: '/cancelledlogistics', pageType: 'cancelledlogisticshistory', add: false, edit: false, delete: false, detail: true, payment: false },
  ];

  // ============================================================
  // ---------------------- Constructor ------------------------
  // ============================================================
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public router: Router,
    public intransitService: IntransitFollowupService,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Update page type & buttons on route change
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageTypeAndButtons();
      });
  }

  // ============================================================
  // ---------------------- Lifecycle Hooks --------------------
  // ============================================================
  ngOnInit(): void {
    this.filteredData = [...this.data];
    if (this.isBrowser) this.setRowsPerPage(window.innerWidth);
    this.applyFilterAndPagination();
    this.updatePageTypeAndButtons();

      console.log('intransitOptions in ngOnInit:', this.intransitOptions);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.applyFilterAndPagination();

    if (changes['detailRow'] && this.detailRow) {
      this.selectedRow = this.detailRow;
      this.openModal('detail', this.detailRow);
      this.fetchPayments(this.detailRow.transactionId);
    }
  }

  // ============================================================
  // ---------------------- Window Resize ----------------------
  // ============================================================
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (this.isBrowser) this.setRowsPerPage(event.target.innerWidth);
  }

  private setRowsPerPage(width: number) {
    this.rowsPerPage = width <= 480 ? 1 : 13;
    this.currentPage = 1;
  }

  // ============================================================
  // ---------------------- Pagination -------------------------
  // ============================================================
  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.filteredData.slice(start, start + this.rowsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.rowsPerPage);
  }

  setPage(page: number) {
    this.currentPage = page;
  }
  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  // ============================================================
  // ------------------------- Search --------------------------
  // ============================================================
  onSearch(): void {
    const query = this.searchQuery.toLowerCase();

    const matchesSearch = (value: any): boolean => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string' || typeof value === 'number')
        return String(value).toLowerCase().includes(query);
      if (Array.isArray(value))
        return value.some((item) => matchesSearch(item));
      if (typeof value === 'object')
        return Object.values(value).some((val) => matchesSearch(val));
      return false;
    };

    this.filteredData = this.data.filter((row) => matchesSearch(row));
    this.currentPage = 1;
  }

  private applyFilterAndPagination() {
    this.onSearch();
    if (this.currentPage > this.totalPages)
      this.currentPage = this.totalPages || 1;
  }

  // ============================================================
  // ------------------ Page / Buttons Logic -------------------
  // ============================================================
  hasAnyActionButton(): boolean {
    return (
      this.buttonVisibility.detail ||
      this.buttonVisibility.edit ||
      this.buttonVisibility.payment ||
      this.buttonVisibility.delete
    );
  }

  private updatePageTypeAndButtons() {
    const currentRoute = this.router.url;
    const config = this.routeConfigs.find((cfg) => currentRoute.includes(cfg.match));
    if (config) {
      this.pageType = config.pageType;
      Object.assign(this.buttonVisibility, {
        add: config.add ?? false,
        edit: config.edit ?? false,
        delete: config.delete ?? false,
        detail: config.detail ?? false,
        payment: config.payment ?? false,
      });
    } else {
      this.pageType = null;
      Object.assign(this.buttonVisibility, {
        add: false,
        edit: false,
        delete: false,
        detail: false,
        payment: false,
      });
    }
  }

  // ============================================================
  // -------------------- Modals & Scroll ----------------------
  // ============================================================
  openModal(modal: keyof typeof this.showModal, row?: any) {
    this.showModal[modal] = true;
    if (row) this.selectedRow = row;
    this.toggleBodyScroll(true);
  }

  closeModal(modal?: keyof typeof this.showModal) {
    if (modal) this.showModal[modal] = false;
    else Object.keys(this.showModal).forEach(
      (key) => (this.showModal[key as keyof typeof this.showModal] = false)
    );
    this.selectedRow = null;
    this.newPayments = [];
    this.toggleBodyScroll(false);
  }

  private toggleBodyScroll(disable: boolean) {
    if (!this.isBrowser) return;
    document.body.classList.toggle('modal-open', disable);
  }

  // ============================================================
  // ------------------------ Payments -------------------------
  // ============================================================
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
      },
    });
  }

  addPaymentRow(): void {
    this.newPayments.push({ amountPaid: '', paidBy: '', accountPaidFrom: '', paidDate: '' });
  }

  removePaymentRow(index: number): void {
    this.newPayments.splice(index, 1);
  }

  submitPayments(): void {
    if (this.newPayments.some(p =>
      !p.amountPaid || !p.paidBy?.trim() || !p.accountPaidFrom?.trim() || !p.paidDate
    )) {
      alert('Please fill out all required fields before saving.');
      return;
    }

    const transactionId = this.selectedRow?.transactionId;
    if (!transactionId) {
      alert('Missing transaction id');
      return;
    }

    this.addPayment.emit({ transactionId, payments: this.newPayments });
    this.closeModal('payment');
  }

  // ============================================================
  // ------------------------ Add / Edit -----------------------
  // ============================================================
  openAddModal() {
    this.addData = {
      purchaseDate: '',
      purchaseOrder: '',
      purchaseCompany: '',
      contactPerson: '',
      origin: '',
      remark: '',
      items: [{ itemDescription: '', quantity: '', unitPrice: '', uom: '', loadedQnty: '', remainingQnty: '' }],
    };
    this.openModal('add');
  }

  addItem(target: 'add' | 'edit') {
    const arr = target === 'add' ? this.addData.items : this.editData.items;
    arr.push({ itemDescription: '', quantity: '', unitPrice: '', uom: '', loadedQnty: '', remainingQnty: '' });
  }

  removeItem(target: 'add' | 'edit', index: number) {
    const arr = target === 'add' ? this.addData.items : this.editData.items;
    if (arr.length > 1) arr.splice(index, 1);
  }

  saveAddClick(): void {
    const missing: string[] = [];
    const d = this.addData;

    if (!d.purchaseOrder?.trim()) missing.push('Purchase Order');
    if (!d.purchaseDate) missing.push('Purchase Date');
    if (!d.origin?.trim()) missing.push('Origin');
    if (!d.purchaseCompany?.trim()) missing.push('Purchase Company');
    if (!d.contactPerson?.trim()) missing.push('Contact Person');

    d.items.forEach((i: any, idx: number) => {
      if (!i.itemDescription?.trim()) missing.push(`Item #${idx + 1} Description`);
      if (!i.uom?.trim()) missing.push(`Item #${idx + 1} UOM`);
      if (!i.quantity || isNaN(Number(i.quantity))) missing.push(`Item #${idx + 1} Quantity`);
      if (!i.unitPrice || isNaN(Number(i.unitPrice))) missing.push(`Item #${idx + 1} Unit Price`);
      i.loadedQnty = 0;
      i.remainingQnty = Number(i.quantity) || 0;
    });

    if (missing.length > 0) {
      alert('Please fill: ' + missing.join(', '));
      return;
    }

    this.add.emit(d);
    this.closeModal('add');
  }

  openEditModal(row: any) {
    this.editData = JSON.parse(JSON.stringify(row));
    this.openModal('edit', row);
    if (!this.editData.payments) this.editData.payments = [];
  }

  saveEditClick(): void {
    this.edit.emit(this.editData);
    this.closeModal('edit');
  }

  // ============================================================
  // ------------------------- Delete --------------------------
  // ============================================================
  openDeleteModal(row: any) {
    this.selectedRow = row;       
    this.activeTab = 'delete';    
    this.showModal.main = true;   
  }

  confirmDeleteClick(): void {
    if (!this.selectedRow) {
      alert('No row selected!');
      return;
    }
    this.delete.emit(this.selectedRow);  
    this.closeModal('main');             
  }

  // ============================================================
  // ----------------------- Main Modal ------------------------
  // ============================================================
  openMainModal(row: any) {
    this.selectedRow = row;
    this.editData = JSON.parse(JSON.stringify(row));
    this.activeTab = 'detail';
    this.paymentTerms = row.payments ?? [];
    this.openModal('main');
    if (!this.editData.payments) this.editData.payments = [];
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'detail') this.paymentTerms = this.selectedRow?.payments ?? [];
  }




  // ============================================================
  // ----------------------- Logistics related -----------------
  // ============================================================

  // Triggered when a transaction is selected
  onTransactionSelect(row: any) {
    this.transactionChange.emit(row); // parent will update available items
  }

  // Triggered when an item is selected
  onItemSelect(row: any) {
    this.itemChange.emit(row); // parent will update UOM and total quantity
  }

  // Triggered when "+ Add Item" is clicked in logistics modal
  addLogistics() {
    this.logisticsAdd.emit();
  }

  // Triggered when removing an item in logistics modal
  removeLogistics(index: number) {
    this.logisticsRemove.emit(index);
  }



}

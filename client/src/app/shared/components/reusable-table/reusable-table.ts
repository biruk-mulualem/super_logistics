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
import { LogisticsFollowupService } from '../../../services/logistics-followup.service';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-reusable-table',
  templateUrl: './reusable-table.html',
  styleUrls: ['./reusable-table.css'],
})
export class ReusableTable implements OnInit, OnChanges {
  // ============================================================
  // ---------------------- Inputs / Outputs --------------------
  // ============================================================

  @Input() headers: { label: string; key: string }[] = []; // Table headers
  @Input() data: any[] = []; // Main data source
  @Input() detailRow: any; // Row for detail view
  @Input() paymentTerms: any[] = []; // Payments for selected row
  @Input() editData: any = {}; // Data for edit modal
  @Input() showEditModal: boolean = false; // Control edit modal visibility
  @Input() intransitOptions: any[] = []; // Options for transactions/items

  @Output() add = new EventEmitter<any>(); // Emit new intransit data
  @Output() edit = new EventEmitter<any>(); // Emit edited data
  @Output() delete = new EventEmitter<any>(); // Emit delete action
  @Output() addPayment = new EventEmitter<any>(); // Emit payment additions

  // Shared events between intransit & logistics
  @Output() transactionChange = new EventEmitter<any>();
  @Output() itemChange = new EventEmitter<any>();
  @Output() addItemEvent = new EventEmitter<void>();
  @Output() removeItemEvent = new EventEmitter<number>();
  @Output() intransitOptionsChange = new EventEmitter<any[]>();

  // Logistics-specific events
  @Output() logisticsAdd = new EventEmitter<any>();
  @Output() logisticsRemove = new EventEmitter<any>();

  // Emit updated intransit options
  updateIntransitOptions(newOptions: any[]) {
    this.intransitOptionsChange.emit(newOptions);
  }

  // ============================================================
  // ---------------- Common State / Constants ------------------
  // ============================================================
  filteredData: any[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  rowsPerPage: number = 13;

  showModal = {
    add: false,
    edit: false,
    delete: false,
    detail: false,
    payment: false,
    main: false,
  };

  selectedRow: any = null; // Currently selected row
  newPayments: any[] = []; // Temporary payments in modal
  addData: any = {}; // Data for add modal
  deleteRowData: any = null; // Row selected for delete
  activeTab: string = 'detail'; // Active tab in main modal

  uoms: string[] = [
    'mg', 'g', 'kg', 'ton', 'lb', 'oz', 'ml', 'l', 'pcs', 'box',
    'roll', 'pack', 'dozen', 'set', 'bottle', 'can', 'bag', 'sheet',
    'meter', 'cm', 'inch', 'yard', 'sqft', 'sqm', 'gallon', 'quart',
    'pint', 'fluid_oz', 'tube', 'carton', 'crate', 'pail', 'jar',
    'packaging_unit', 'bundle', 'set', 'pair', 'reel', 'sheet_metal',
    'roll_fabric', 'drum',
  ];

  origins: string[] = [
    'china', 'india', 'usa', 'germany', 'japan', 'south_korea',
    'france', 'uk', 'italy', 'canada', 'mexico', 'brazil', 'russia',
    'turkey', 'australia', 'singapore', 'netherlands', 'belgium',
    'switzerland', 'uae', 'thailand', 'vietnam', 'malaysia', 'indonesia',
  ];

  containerTypes = ['20ft', '40ft', '45ft_HC', 'Open Top', 'Flat Rack'];

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
    { match: '/intransit', pageType: 'intransit', add: true, edit: true, delete: true, detail: true, payment: false },
    { match: '/logistics', pageType: 'logistics', add: true, edit: true, delete: true, detail: true, payment: false },
    { match: '/reports', pageType: 'reports', add: false, edit: true, delete: false, detail: true, payment: false },
    { match: '/history', pageType: 'history', add: false, edit: false, delete: false, detail: true, payment: false },
    { match: '/donelogistics', pageType: 'donelogisticshistory', add: false, edit: false, delete: false, detail: true, payment: false },
    { match: '/doneintransit', pageType: 'doneintransithistory', add: false, edit: false, delete: false, detail: true, payment: false },
    { match: '/cancelledintransit', pageType: 'cancelledintransithistory', add: false, edit: false, delete: false, detail: true, payment: false },
    { match: '/cancelledlogistics', pageType: 'cancelledlogisticshistory', add: false, edit: false, delete: false, detail: true, payment: false },
  ];

  // ============================================================
  // ---------------------- Constructor -------------------------
  // ============================================================
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public router: Router,
    public intransitService: IntransitFollowupService,
    private logisticsService: LogisticsFollowupService,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Listen for route changes to update page type & button visibility
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.updatePageTypeAndButtons());
  }

  // ============================================================
  // ---------------------- Lifecycle Hooks ---------------------
  // ============================================================
  ngOnInit(): void {
    this.filteredData = Array.isArray(this.data) ? [...this.data] : [];
    if (this.isBrowser) this.setRowsPerPage(window.innerWidth);
    this.applyFilterAndPagination();
    this.updatePageTypeAndButtons();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.applyFilterAndPagination();

    // Automatically open detail modal if detailRow changes
    if (changes['detailRow'] && this.detailRow) {
      this.selectedRow = this.detailRow;
      this.openModal('detail', this.detailRow);
      this.fetchPayments(this.detailRow.transactionId);
    }
  }

  // ============================================================
  // ------------------- Common Utilities -----------------------
  // ============================================================
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

  setPage(page: number) {
    this.currentPage = page;
  }
  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  // ---------------- Search & Filter ----------------
  onSearch(): void {
    const query = this.searchQuery.toLowerCase();

    const matchesSearch = (value: any): boolean => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string' || typeof value === 'number')
        return String(value).toLowerCase().includes(query);
      if (Array.isArray(value)) return value.some((item) => matchesSearch(item));
      if (typeof value === 'object') return Object.values(value).some((val) => matchesSearch(val));
      return false;
    };

    const sourceData = Array.isArray(this.data) ? this.data : [];
    this.filteredData = sourceData.filter((row) => matchesSearch(row));
    this.currentPage = 1;
  }

  private applyFilterAndPagination() {
    this.onSearch();
    if (this.currentPage > this.totalPages)
      this.currentPage = this.totalPages || 1;
  }

  hasAnyActionButton(): boolean {
    return this.buttonVisibility.detail || this.buttonVisibility.edit || this.buttonVisibility.payment || this.buttonVisibility.delete;
  }

  // Update button visibility and pageType based on route
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
      Object.assign(this.buttonVisibility, { add: false, edit: false, delete: false, detail: false, payment: false });
    }
  }

  // ============================================================
  // ------------------- Modals & Scroll ------------------------
  // ============================================================
  openModal(modal: keyof typeof this.showModal, row?: any) {
    this.showModal[modal] = true;
    if (row) this.selectedRow = row;
    this.toggleBodyScroll(true);
  }

  closeModal(modal?: keyof typeof this.showModal) {
    if (modal) this.showModal[modal] = false;
    else Object.keys(this.showModal).forEach((key) => (this.showModal[key as keyof typeof this.showModal] = false));

    this.selectedRow = null;
    this.newPayments = [];
    this.toggleBodyScroll(false);
  }

  private toggleBodyScroll(disable: boolean) {
    if (!this.isBrowser) return;
    document.body.classList.toggle('modal-open', disable);
  }

  // ============================================================
  // ---------------------- Payments ----------------------------
  // ============================================================
  private fetchPayments(transactionId: string): void {
    this.intransitService.getPaymentData(transactionId).subscribe({
      next: (payments) => {
        this.paymentTerms = payments.length ? payments : [{ amountPaid: '', paidBy: '', accountPaidFrom: '', paidDate: '' }];
        this.cdr.detectChanges();
      },
      error: () => {
        this.paymentTerms = [{ amountPaid: '', paidBy: '', accountPaidFrom: '', paidDate: '' }];
        this.cdr.detectChanges();
      },
    });
  }

  openRowModal(row: any) {
    this.selectedRow = row;
    this.fetchPayments(row.transactionId);
  }

  submitPayments(): void {
    const missingFields = this.validateIntransitPayments(this.newPayments);
    if (missingFields.length > 0) {
      alert('Please fill out all required fields: ' + missingFields.join(', '));
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

  validateIntransitPayments(payments: any[]): string[] {
    const missing: string[] = [];

    payments.forEach((p, idx) => {
      if (!p.amountPaid) missing.push(`Payment #${idx + 1} Amount Paid`);
      if (!p.paidBy?.trim()) missing.push(`Payment #${idx + 1} Paid By`);
      if (!p.accountPaidFrom?.trim()) missing.push(`Payment #${idx + 1} Account Paid From`);
      if (!p.paidDate) missing.push(`Payment #${idx + 1} Paid Date`);
    });

    return missing;
  }

  // ============================================================
  // -------------------- Intransit Add / Edit ------------------
  // ============================================================
  openAddModal() {
    if (this.pageType === 'intransit') {
      this.addData = {
        purchaseDate: '',
        purchaseOrder: '',
        purchaseCompany: '',
        contactPerson: '',
        origin: '',
        remark: '',
        items: [{ itemDescription: '', uom: '', quantity: '', unitPrice: '' }],
      };
    } else if (this.pageType === 'logistics') {
      this.addData = {
        LoadedOnfcl: '',
        containerType: '',
        remark: '',
        items: [
          { transactionId: '', availableItems: [], selectedItem: null, itemDescription: '', uom: '', quantity: 0, LoadedQnty: 0 },
        ],
      };
    }

    this.openModal('add');
  }

  AddIntransitData(): void {
    const missingFields = this.validateIntransitAddData(this.addData);
    if (missingFields.length > 0) {
      alert('Please fill: ' + missingFields.join(', '));
      return;
    }

    this.add.emit(this.addData);
    this.closeModal('add');
  }

  validateIntransitAddData(data: any): string[] {
    const missing: string[] = [];

    // Main fields
    if (!data.purchaseOrder?.trim()) missing.push('Purchase Order');
    if (!data.purchaseDate) missing.push('Purchase Date');
    if (!data.origin?.trim()) missing.push('Origin');
    if (!data.purchaseCompany?.trim()) missing.push('Purchase Company');
    if (!data.contactPerson?.trim()) missing.push('Contact Person');

    // Items
    data.items.forEach((i: any, idx: number) => {
      if (!i.itemDescription?.trim()) missing.push(`Item #${idx + 1} Description`);
      if (!i.uom?.trim()) missing.push(`Item #${idx + 1} UOM`);
      if (!i.quantity || isNaN(Number(i.quantity))) missing.push(`Item #${idx + 1} Quantity`);
      if (!i.unitPrice || isNaN(Number(i.unitPrice))) missing.push(`Item #${idx + 1} Unit Price`);

      i.loadedQnty = 0;
      i.remainingQnty = Number(i.quantity) || 0;
    });

    return missing;
  }

  openEditModal(row: any, type: 'intransit' | 'logistics') {
    this.pageType = type;
    this.editData = JSON.parse(JSON.stringify(row)); // Deep copy
    if (type === 'intransit' && !this.editData.payments) this.editData.payments = [];
    this.openModal('edit', row);
  }

  saveEditedIntransitData(): void {
    this.edit.emit(this.editData);
    this.closeModal();
  }

  saveEditedLogisticsData(): void {
    this.edit.emit(this.editData);
    this.closeModal();
  }

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
  // ------------------- Logistics Related ----------------------
  // ============================================================
  onTransactionSelect(row: any) {
    this.transactionChange.emit(row);
  }

  onItemSelect(row: any) {
    this.itemChange.emit(row);
  }

  onLoadedQntyInput(event: Event, item: any) {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value, 10);
    if (isNaN(value) || value < 0) value = 0;
    else if (value > item.quantity) value = item.quantity;
    item.LoadedQnty = value;
    input.value = String(value);
  }

  onTransactionChange(item: any) {
    const selectedTransaction = this.intransitOptions.find((opt) => opt.transactionId === item.transactionId);
    item.availableItems = selectedTransaction ? selectedTransaction.items : [];
    item.selectedItem = null;
    item.itemDescription = '';
    item.uom = '';
    item.quantity = '';
  }

  onItemChange(itemRow: any) {
    const selected = itemRow.selectedItem;
    if (selected) {
      itemRow.itemDescription = selected.itemDescription;
      itemRow.uom = selected.uom;
      itemRow.quantity = selected.quantity;
    }
  }

  // ---------------- Validation ----------------
  validateLogisticsAddData(): string[] {
    const missing: string[] = [];
    if (!this.addData.LoadedOnfcl || isNaN(Number(this.addData.LoadedOnfcl))) missing.push('Loaded On FCL');
    if (!this.addData.containerType?.trim()) missing.push('Container Type');

    if (!this.addData.items || this.addData.items.length === 0) missing.push('At least one item');
    else {
      this.addData.items.forEach((item: any, idx: number) => {
        if (!item.transactionId?.trim()) missing.push(`Item #${idx + 1} Transaction ID`);
        if (!item.itemDescription?.trim()) missing.push(`Item #${idx + 1} Description`);
        if (!item.uom?.trim()) missing.push(`Item #${idx + 1} UOM`);
        if (!item.LoadedQnty || isNaN(Number(item.LoadedQnty))) missing.push(`Item #${idx + 1} Loaded Quantity`);
      });
    }

    return missing;
  }

  // ---------------- Submit ----------------
  saveAddLogsticsData() {
    const missingFields = this.validateLogisticsAddData();
    if (missingFields.length > 0) {
      alert('Please fill: ' + missingFields.join(', '));
      return;
    }

    const payload = {
      LoadedOnfcl: Number(this.addData.LoadedOnfcl),
      containerType: this.addData.containerType,
      remark: this.addData.remark,
      items: this.addData.items.map((item: any) => ({
        transactionId: item.transactionId,
        itemDescription: item.itemDescription,
        uom: item.uom,
        quantity: item.LoadedQnty,
        totalQuantity: item.quantity,
      })),
    };

    console.log('🚀 Clean Logistics payload emitted:', payload);
    this.logisticsAdd.emit(payload);
    this.closeModal('add');
  }

  // ============================================================
  // ------------------- Add / Remove Rows ----------------------
  // ============================================================
addRow(
  target: 'add' | 'edit' | 'logistics' | 'payment' | 'editIntransitItem' | 'editIntransitPayment' | 'editLogisticsItem'
) {
  let arr;

  if (target === 'logistics') {
    if (!this.addData.items) this.addData.items = [];
    arr = this.addData.items;
    arr.push({
      transactionId: '',
      availableItems: [],
      selectedItem: null,
      itemDescription: '',
      uom: '',
      quantity: '',
      LoadedQnty: ''
    });

  } else if (target === 'payment') {
    if (!this.newPayments) this.newPayments = [];
    arr = this.newPayments;
    arr.push({
      amountPaid: '',
      paidBy: '',
      accountPaidFrom: '',
      paidDate: ''
    });

  } else if (target === 'editIntransitItem') {
    if (!this.editData.items) this.editData.items = [];
    arr = this.editData.items;
    arr.push({
      itemDescription: '',
      quantity: '',
      unitPrice: '',
      uom: '',
    });

  } else if (target === 'editIntransitPayment') {
    if (!this.editData.payments) this.editData.payments = [];
    arr = this.editData.payments;
    arr.push({
      amountPaid: '',
      paidBy: '',
      accountPaidFrom: '',
      paidDate: ''
    });

  } else if (target === 'editLogisticsItem') {
    if (!this.editData.items) this.editData.items = [];
    arr = this.editData.items;
    arr.push({
      itemDescription: '',
      quantity: '',
      unitPrice: '',
      uom: ''
    });

  } else {
    arr = target === 'add' ? this.addData.items : this.editData.items;
    arr.push({
      itemDescription: '',
      quantity: '',
      unitPrice: '',
      uom: '',
      loadedQnty: '',
      remainingQnty: ''
    });
  }
}
removeRow(
  target: 'add' | 'edit' | 'logistics' | 'payment' | 'editIntransitItem' | 'editIntransitPayment' | 'editLogisticsItem',
  index: number
) {
  let arr;

  if (target === 'logistics') {
    arr = this.addData.items;
    if (arr.length > 1) arr.splice(index, 1);

  } else if (target === 'payment') {
    arr = this.newPayments;
    if (arr.length > 1) arr.splice(index, 1);

  } else if (target === 'editIntransitItem') {
    arr = this.editData.items;
    arr.splice(index, 1);

  } else if (target === 'editIntransitPayment') {
    arr = this.editData.payments;
    arr.splice(index, 1);

  } else if (target === 'editLogisticsItem') {
    arr = this.editData.items;
    arr.splice(index, 1);

  } else {
    arr = target === 'add' ? this.addData.items : this.editData.items;
    if (arr.length > 1) arr.splice(index, 1);
  }
}









  
}

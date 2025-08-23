import {Component,Input,Output,EventEmitter,OnInit,OnChanges,SimpleChanges,HostListener,Inject,PLATFORM_ID,ChangeDetectorRef} from '@angular/core';
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

  // component.ts
uoms: string[] = [
  "mg","g","kg","ton","lb","oz","ml","l","pcs","box","roll","pack","dozen",
  "set","bottle","can","bag","sheet","meter","cm","inch","yard","sqft","sqm",
  "gallon","quart","pint","fluid_oz","tube","carton","crate","pail","jar",
  "packaging_unit","bundle","lot","pair","reel","sheet_metal","roll_fabric","drum"
];

origins: string[] = [
  "china","india","usa","germany","japan","south_korea","france","uk","italy",
  "canada","mexico","brazil","russia","turkey","australia","singapore",
  "netherlands","belgium","switzerland","uae","thailand","vietnam",
  "malaysia","indonesia"
];

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

  // Recursive search function
  function matchesSearch(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string' || typeof value === 'number') {
      return String(value).toLowerCase().includes(query);
    }
    if (Array.isArray(value)) {
      return value.some(item => matchesSearch(item));
    }
    if (typeof value === 'object') {
      return Object.values(value).some(val => matchesSearch(val));
    }
    return false;
  }

  this.filteredData = this.data.filter(row => matchesSearch(row));
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
    origin: '',
    remark: '',
    items: [{ itemDescription: '', quantity: '', unitPrice: '', uom: '', loadedQnty: '', remainingQnty: '' }]
  };
  this.showAddModal = true;
  this.toggleBodyScroll(true);
}

addItemRow(): void {
  this.addRow(this.addData.items, {
    itemDescription: '',
    quantity: '',
    unitPrice: '',
    uom: '',
    loadedQnty: '',
    remainingQnty: ''
  });
}


  removeItem(index: number): void { this.removeRow(this.addData.items, index); }

saveAddClick(): void {
  const missingFields: string[] = [];

  // Validate main fields
  if (!this.addData.purchaseOrder?.trim()) missingFields.push('Purchase Order');
  if (!this.addData.purchaseDate) missingFields.push('Purchase Date');
  if (!this.addData.origin?.trim()) missingFields.push('Origin');
  if (!this.addData.purchaseCompany?.trim()) missingFields.push('Purchase Company');
  if (!this.addData.contactPerson?.trim()) missingFields.push('Contact Person');

  // Validate each item row and set defaults
  this.addData.items.forEach((item: { itemDescription: string; uom: string; quantity: any; unitPrice: any; loadedQnty: number; remainingQnty: number; }, index: number) => {
    if (!item.itemDescription?.trim()) missingFields.push(`Item #${index + 1} Description`);
    if (!item.uom?.trim()) missingFields.push(`Item #${index + 1} UOM`);
    const quantity = Number(item.quantity);
    const unitPrice = Number(item.unitPrice);
    if (!quantity || isNaN(quantity)) missingFields.push(`Item #${index + 1} Quantity`);
    if (!unitPrice || isNaN(unitPrice)) missingFields.push(`Item #${index + 1} Unit Price`);

    // Set defaults for LoadedQnty and RemainingQnty
    item.loadedQnty = 0;
    item.remainingQnty = quantity || 0;
  });

  // Show popup if anything is missing
  if (missingFields.length > 0) {
    alert('Please fill out the following fields:\n- ' + missingFields.join('\n- '));
    return;
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
  if (!this.deleteRowData) {
    alert('No row selected to delete.');
    return;
  }
  this.delete.emit(this.deleteRowData);
  this.closeModal(); // ✅ close after delete
}

  // =======================
  // --- Detail Modal ---
  // =======================
openDetailModal(row: any): void {
  this.selectedRow = row;
  this.showDetailModal = true;
  this.toggleBodyScroll(true);

  setTimeout(() => {
    this.intransitService.getPaymentData(row.transactionId).subscribe({
      next: (payments) => {
        this.paymentTerms = payments.length
          ? payments
          : [{ amountPaid:'', paidBy:'', accountPaidFrom:'', paidDate:'' }];
        this.cdr.detectChanges(); // <-- triggers Angular change detection
      },
      error: () => {
        this.paymentTerms = [{ amountPaid:'', paidBy:'', accountPaidFrom:'', paidDate:'' }];
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
      return;
    }
  }

  const transactionId =
    this.selectedRowForPayment?.transactionId ?? this.selectedMainRow?.transactionId;

  if (!transactionId) {
    alert('Missing transaction id for payment.');
    return;
  }

  const payload = { transactionId, payments: this.newPayments };
  this.addPayment.emit(payload);

  // ✅ close modal after successful submit
  this.closeModal();
}
  //from this point down is the ts related to the mainmodal
// Property to control modal visibility
showMainModal: boolean = false;
selectedMainRow: any = null;

activeTab: string = 'detail'; // Default

openMainModal(row: any) {
  this.selectedMainRow = row;
  this.selectedRowForPayment = row;
  this.deleteRowData = row;
  this.activeTab = 'detail';
  this.showMainModal = true;

  this.editData = JSON.parse(JSON.stringify(row));

  // ✅ ensure payments are available for detail tab
  this.paymentTerms = row.payments ?? [];

  if (!this.editData.payments) {
    this.editData.payments = [];
  }
}

setActiveTab(tab: string): void {
  this.activeTab = tab;

  // If user clicks "detail", populate payments from the selected row
  if (tab === 'detail' && this.selectedMainRow) {
    this.paymentTerms = this.selectedMainRow.payments ?? [];
  }
}
// Generic close modal function
closeModal(): void {
  this.showMainModal = false;
  this.showAddModal = false;
  this.showEditModal = false;
  this.showDeleteModal = false;
  this.showDetailModal = false;
  this.showPaymentModal = false;

  this.selectedMainRow = null;
  this.selectedRow = null;
  this.selectedRowForPayment = null;
  this.deleteRowData = null;
  this.newPayments = [];
  
  this.toggleBodyScroll(false);
}

}

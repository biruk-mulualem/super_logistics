import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReusableTable } from '../../shared/components/reusable-table/reusable-table';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Header } from '../../shared/components/header/header';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { IntransitFollowupService } from '../../services/intransit-followup.service';

@Component({
  selector: 'app-intransit',
  imports: [FormsModule, ReusableTable, Sidebar, Header],
  templateUrl: './intransit.html',
  styleUrls: ['./intransit.css']
})
export class Intransit implements OnInit, OnDestroy {
  tableHeaders = [
    { label: 'Id', key: 'id' },
    { label: 'Ref NO.', key: 'transactionId' },
  
    { label: 'Purchase Date', key: 'purchaseDate' },
    { label: 'Purchase Order', key: 'purchaseOrder' },
    { label: 'Total Price', key: 'totalPrice', isDecimal: true },
    { label: 'Total  Paid', key: 'totalAmountPaid', isDecimal: true },
    { label: 'Total Paid (%)', key: 'totalPaidInPercent', isDecimal: true },
    { label: 'Total Remaning', key: 'totalAmountRemaning', isDecimal: true },
    { label: 'Total Remaning (%)', key: 'totalRemaningInPercent', isDecimal: true }
  ];

  detailHeaders = [
  { label: 'Origin', key: 'origin' },
    { label: 'Item Description', key: 'itemDescription' },
    { label: 'UOM', key: 'uom' },
    { label: 'Quantity', key: 'quantity', isDecimal: true },
    { label: 'Unit Price()', key: 'unitPrice', isDecimal: true },
    { label: 'Purchase Company', key: 'purchaseCompany' },
    { label: 'Contact Person', key: 'contactPerson' },
    { label: 'GRN', key: 'grn' },
    { label: 'Remark', key: 'remark' },
  
  ]; 

  tableData: any[] = [];
  editData: any = null;
  showEditModal = false;
  showAddModal = false;
  showPaymentModal = false;
  selectedRowForPayment: any = null;
  addData: any = null;
  paymentTerms: any[] = [];
  selectedRowForDetail: any = null;

  private routerSub?: Subscription;

  constructor(
    private intransitService: IntransitFollowupService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFollowups();

    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.urlAfterRedirects === '/intransit' && this.tableData.length === 0) {
          this.loadFollowups();
        }
      });
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  // --- Load data from backend ---
  loadFollowups() {
    this.intransitService.getIntransitData().subscribe({
      next: (data) => {
        this.tableData = data.map(row => ({
          ...row,
          items: this.parseItems(row.itemQntyUomUnitprice)
        }));
      },
      error: (err) => console.error('Failed to load followups:', err)
    });
  }

  // --- Parse/Serialize utility ---
  private parseItems(serialized: string | null | undefined): any[] {
    if (!serialized) return [];
    return serialized.split(';')
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .map(item => {
        const [descPart, pricePart] = item.split('@').map(x => x.trim());
        const [itemDescription, quantityUom] = descPart.split(':').map(x => x.trim());
        const [quantityStr, uom] = quantityUom.split(' ').map(x => x.trim());
        return {
          itemDescription,
          quantity: Number(quantityStr),
          uom,
          unitPrice: Number(pricePart.replace('$', '').trim())
        };
      });
  }

  private serializeItems(items: any[]): string {
    if (!items || items.length === 0) return '';
    return items.map(it => `${it.itemDescription}:${it.quantity} ${it.uom} @ ${it.unitPrice}$`).join('; ');
  }

  // --- Edit modal ---
  openEditModal(row: any) {
    this.editData = { ...row, items: JSON.parse(JSON.stringify(row.items)) };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editData = null;
  }

  // --- Add Intransit ---
  addIntransit() {
    this.addData = {
      items: [{ itemDescription: '', quantity: '', unitPrice: '', uom: '' }],
      purchaseOrder: '',
      purchaseDate: '',
      origin: '',
      purchaseCompany: '',
      contactPerson: '',
      remark: ''
    };
    this.showAddModal = true;
  }

  // --- Save Intransit ---
  saveIntransit(data: any) {
    const payload = { ...data, itemQntyUomUnitprice: this.serializeItems(data.items) };
    this.intransitService.createIntransitData(payload).subscribe({
      next: (created) => {
        const parsed = { ...created, items: this.parseItems(created.itemQntyUomUnitprice) };
        this.tableData = [...this.tableData, parsed];
        this.showAddModal = false;
      },
      error: (err) => console.error('Failed to save intransit:', err)
    });
  }









  

  // --- Save Payment ---
savePayment(payload: any) {
  const mappedPayload = payload.payments.map((pt: any) => ({
    transactionId: payload.transactionId,
    amountPaid: pt.amountPaid,
    paidBy: pt.paidBy,
    accountPaidFrom: pt.accountPaidFrom,
    paidDate: pt.paidDate // ensure yyyy-MM-dd
  }));

  this.intransitService.createPaymentTerms(mappedPayload).subscribe({
    next: () => {
      console.log('Payment saved successfully');
      this.loadFollowups();
      this.showPaymentModal = false;
      this.selectedRowForPayment = null;
      this.paymentTerms = [];
    },
    error: (err) => console.error('Failed to save payment:', err)
  });
}



  // --- Delete ---
  onDelete(rowData: any) {
    this.intransitService.deleteIntransitData(rowData.id).subscribe({
      next: () => {
        this.tableData = this.tableData.filter(row => row.id !== rowData.id);
      },
      error: (err) => console.error('Failed to delete:', err)
    });
  }

  // --- Save Edit ---
  saveEdit(updatedData: any) {
    const payload = { ...updatedData, itemQntyUomUnitprice: this.serializeItems(updatedData.items) };
    this.intransitService.updateIntransitData(payload.id, payload).subscribe({
      next: (res) => {
        const parsed = { ...res, items: this.parseItems(res.itemQntyUomUnitprice) };
        const idx = this.tableData.findIndex(r => r.id === res.id);
        if (idx > -1) this.tableData[idx] = parsed;
        this.closeEditModal();
      },
      error: (err) => console.error('Failed to update:', err)
    });
  }
}

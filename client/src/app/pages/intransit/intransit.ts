import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReusableTable } from '../../shared/components/reusable-table/reusable-table';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Header } from '../../shared/components/header/header';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { IntransitFollowupService } from '../../services/intransit-followup.service';

@Component({
  selector: 'app-intransit',
  imports: [FormsModule, ReusableTable, Sidebar, Header],
  templateUrl: './intransit.html',
  styleUrls: ['./intransit.css']
})
export class Intransit implements OnInit {

  // ---------------- Headers ----------------
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

  // ---------------- Data ----------------
  tableData: any[] = [];
  editData: any = null;
  addData: any = null;
  paymentTerms: any[] = [];
  selectedRowForPayment: any = null;
  showEditModal = false;
  showAddModal = false;
  showPaymentModal = false;
  editDataForChild: any = {};

  constructor(
    private intransitService: IntransitFollowupService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Load table data from resolver on page load or refresh
    this.tableData = this.route.snapshot.data['tableData'] || [];
  }

  // ---------------- Load Table ----------------
  async loadFollowups() {
    try {
      const data = await firstValueFrom(this.intransitService.getIntransitData());
      if (!data) { this.tableData = []; return; }

      const tableWithDetails = await Promise.all(
        data.map(async row => {
          const [items, payments] = await Promise.all([
            firstValueFrom(this.intransitService.getIntransitItemsDetailData(row.transactionId)),
            firstValueFrom(this.intransitService.getPaymentData(row.transactionId))
          ]);
          return { ...row, items, payments };
        })
      );

      this.tableData = tableWithDetails;
    } catch (err) {
      console.error('Failed to load followups:', err);
      this.tableData = [];
    }
  }

  // ---------------- Add ----------------
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

  async saveIntransit(data: any) {
    try {
      await firstValueFrom(this.intransitService.createIntransitData(data));
      await this.loadFollowups();
      this.showAddModal = false;
    } catch (err) {
      console.error('Failed to save intransit:', err);
    }
  }

  // ---------------- Edit ----------------
  async openEditModal(row: any) {
    this.showEditModal = true;

    const [items, payments] = await Promise.all([
      firstValueFrom(this.intransitService.getIntransitItemsDetailData(row.transactionId)),
      firstValueFrom(this.intransitService.getPaymentData(row.transactionId))
    ]);

    this.editData = {
      ...row,
      items: items.length ? items : [{ itemDescription:'', quantity:'', unitPrice:'', uom:'' }],
      payments: payments.length ? payments : [{ amountPaid:'', paidBy:'', accountPaidFrom:'', paidDate:'' }]
    };
  }

  async saveEdit(updatedData: any) {
    const payload = { ...updatedData, items: updatedData.items };
    const paymentPayload = { Payments: updatedData.payments };

    try {
      await firstValueFrom(this.intransitService.updateIntransitData(payload.id, payload));
      await firstValueFrom(this.intransitService.updatePaymentData(payload.id, paymentPayload));

      await this.loadFollowups();
      this.closeEditModal();
    } catch (err) {
      console.error('Failed to update intransit or payments:', err);
    }
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editData = null;
  }

  // ---------------- Payment ----------------
  savePayment(payload: any) {
    const mappedPayload = payload.payments.map((pt: any) => ({
      transactionId: payload.transactionId,
      amountPaid: pt.amountPaid,
      paidBy: pt.paidBy,
      accountPaidFrom: pt.accountPaidFrom,
      paidDate: pt.paidDate
    }));

    this.intransitService.createPaymentTerms(mappedPayload).subscribe({
      next: () => {
        this.loadFollowups();
        this.showPaymentModal = false;
        this.selectedRowForPayment = null;
        this.paymentTerms = [];
      },
      error: (err) => console.error('Failed to save payment:', err)
    });
  }

  // ---------------- Delete ----------------
  onDelete(rowData: any) {
    this.intransitService.deleteIntransitData(rowData.id).subscribe({
      next: () => this.loadFollowups(),
      error: (err) => console.error('Failed to delete:', err)
    });
  }







  
}



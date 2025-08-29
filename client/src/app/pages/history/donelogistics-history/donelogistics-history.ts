import { Component, OnInit } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { ReusableTable } from '../../../shared/components/reusable-table/reusable-table';

import { firstValueFrom } from 'rxjs';



import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogisticsFollowupService } from '../../../services/logistics-followup.service';
@Component({
  selector: 'app-donelogistics-history',
 imports: [Header, Sidebar, ReusableTable],
  templateUrl: './donelogistics-history.html',
  styleUrl: './donelogistics-history.css'
})
// export class DonelogisticsHistory implements OnInit {
export class DonelogisticsHistory  {
 tableHeaders = [
    { label: 'Id', key: 'id' },
    { label: 'Ref NO.', key: 'transactionId' },
    { label: 'Purchase Date', key: 'purchaseDate' },
    { label: 'Purchase Order', key: 'purchaseOrder' },
    { label: 'Total Price', key: 'totalPrice', isDecimal: true },
    { label: 'Total Paid', key: 'totalAmountPaid', isDecimal: true },
    { label: 'Total Paid (%)', key: 'totalPaidInPercent', isDecimal: true },
    { label: 'Total Remaining', key: 'totalAmountRemaning', isDecimal: true },
    { label: 'Total Remaining (%)', key: 'totalRemaningInPercent', isDecimal: true }
  ];

  detailHeaders = [
    { label: 'Origin', key: 'origin' },
    { label: 'Item Description', key: 'itemDescription' },
    { label: 'UOM', key: 'uom' },
    { label: 'Quantity', key: 'quantity', isDecimal: true },
    { label: 'Unit Price', key: 'unitPrice', isDecimal: true },
    { label: 'Purchase Company', key: 'purchaseCompany' },
    { label: 'Contact Person', key: 'contactPerson' },
    { label: 'GRN', key: 'grn' },
    { label: 'Remark', key: 'remark' }
  ];

  tableData: any[] = [];

  constructor(private logisticsService: LogisticsFollowupService) {}

  // ngOnInit(): void {
  //   this.loadFollowups();
  // }






  //   async loadFollowups() {
  //   try {
  //     const data = await firstValueFrom(this.logisticsService.getIntransitStatus1Data());
  //     if (!data) { this.tableData = []; return; }

  //     const tableWithDetails = await Promise.all(
  //       data.map(async row => {
  //         const [items, payments] = await Promise.all([
  //           firstValueFrom(this.logisticsService.getIntransitItemsDetailStatus1Data(row.transactionId)),
  //           firstValueFrom(this.logisticsService.getPaymentData(row.transactionId))
  //         ]);
  //         return { ...row, items, payments };
  //       })
  //     );

  //     this.tableData = tableWithDetails;
  //   } catch (err) {
  //     console.error('Failed to load followups:', err);
  //     this.tableData = [];
  //   }
  // }

}

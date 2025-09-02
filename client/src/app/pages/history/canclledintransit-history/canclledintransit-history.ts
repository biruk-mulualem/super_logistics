import { Component, OnInit } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { ReusableTable } from '../../../shared/components/reusable-table/reusable-table';

import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { IntransitFollowupService } from '../../../services/services/intransit/intransit-followup.service';

@Component({
  selector: 'app-cancelled-intransit-history',
  imports: [Header, Sidebar, ReusableTable],
  templateUrl: './canclledintransit-history.html', // <-- fixed typo
  styleUrls: ['./canclledintransit-history.css']
})
export class CancelledIntransitHistory implements OnInit {
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

  constructor(
    private intransitService: IntransitFollowupService,
     private route: ActivatedRoute
  ) {}

   ngOnInit() {
  // Load table data from resolver
  this.tableData = this.route.snapshot.data['tableData'] || [];
}





    async loadFollowups() {
    try {
      const data = await firstValueFrom(this.intransitService.getIntransitStatus0Data());
      if (!data) { this.tableData = []; return; }

      const tableWithDetails = await Promise.all(
        data.map(async row => {
          const [items, payments] = await Promise.all([
            firstValueFrom(this.intransitService.getIntransitItemsDetailStatus0Data(row.transactionId)),
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
}

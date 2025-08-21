import { Component, OnInit } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { ReusableTable } from '../../../shared/components/reusable-table/reusable-table';
import { IntransitFollowupService } from '../../../services/intransit-followup.service';

@Component({
  selector: 'app-cancelled-intransit-history',
  imports: [Header, Sidebar, ReusableTable],
  templateUrl: './canclledintransit-history.html',
  styleUrls: ['./canclledintransit-history.css'] // <-- fixed typo
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

  constructor(private intransitService: IntransitFollowupService) {}

  ngOnInit(): void {
    this.intransitService.getIntransitStatus0Data().subscribe({
      next: (data: any[]) => {
        // Parse item details for each row
        this.tableData = data.map(row => ({
          ...row,
          items: this.parseItems(row.itemQntyUomUnitprice)
        }));
      },
      error: (err: any) => console.error('Error fetching cancelled intransit:', err)
    });
  }

  // --- Utility to parse serialized items ---
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
}

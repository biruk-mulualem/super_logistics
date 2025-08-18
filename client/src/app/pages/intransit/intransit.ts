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
    { label: 'Ref Id', key: 'transactionId' },
    { label: 'Purchase Date', key: 'purchaseDate' },
        { label: 'Purchase Order', key: 'purchaseOrder' },
    { label: 'Item Description', key: 'itemDescription' },
    { label: 'UOM', key: 'uom' },
    { label: 'Quantity', key: 'quantity' },
    { label: 'Paid From', key: 'paidFrom' },
    { label: 'Unit Price', key: 'unitPrice' },
    { label: 'Total Price', key: 'totalPrice' },
    { label: 'Total Amount Paid', key: 'totalAmountPaid' },
    { label: 'Total Paid (%)', key: 'totalPaidInPercent' },
  ];

  detailHeaders = [
    { label: 'Purchase Company', key: 'purchaseCompany' },
    { label: 'Contact Person', key: 'contactPerson' },
    { label: 'Quantity Received', key: 'qntyRecived' },
    { label: 'Quantity Remaining', key: 'qntyRemaning' },
    { label: 'GRN', key: 'grn' },
    { label: 'Remark', key: 'remark' }
  ];

  tableData: any[] = [];
  private routerSub?: Subscription;

  constructor(
    private intransitService: IntransitFollowupService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFollowups(); // load once on init

    // Optional: reload only when navigating back, but will skip if data exists
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
      next: (data) => this.tableData = data,
      error: (err) => console.error('Failed to load followups:', err)
    });
  }

  // --- Handle Add ---
  saveAdd(newData: any) {
    this.intransitService.createIntransitData(newData).subscribe({
      next: (created) => {
        this.tableData = [...this.tableData, created]; // append locally
      },
      error: err => console.error('Failed to add:', err)
    });
  }

  // --- Handle Edit ---
onEdit(updatedData: any) {
  // Create a payload without server-calculated fields
  const payload = { ...updatedData };
  delete payload.totalPrice;
  delete payload.totalPaidInPercent;

  this.intransitService.updateIntransitData(updatedData.id, payload).subscribe({
    next: (savedData) => {
      // Update the table row with backend response
      this.tableData = this.tableData.map(row =>
        row.id === savedData.id ? savedData : row
      );
    },
    error: (err) => console.error('Failed to update:', err)
  });
}


  // --- Handle Delete ---
  onDelete(rowData: any) {
    this.intransitService.deleteIntransitData(rowData.id).subscribe({
      next: () => {
        this.tableData = this.tableData.filter(row => row.id !== rowData.id);
      },
      error: (err) => console.error('Failed to delete:', err)
    });
  }
}

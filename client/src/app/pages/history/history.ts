import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReusableTable } from '../../shared/components/reusable-table/reusable-table';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Header } from '../../shared/components/header/header';

import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HistoryService } from '../../services/history.service';


@Component({
  selector: 'app-history',
  imports: [ReusableTable,Sidebar,Header],
  templateUrl: './history.html',
  styleUrl: './history.css'
})

export class History implements OnInit {
  tableHeaders = [
    { label: 'Id', key: 'id' },
    { label: 'Item', key: 'itemDescription' },
    { label: 'Uom', key: 'uom' },
    { label: 'Quantity', key: 'quantity' },
    { label: 'No-Cont', key: 'loadedOnfcl' },
    { label: 'Cont-Type', key: 'containerType' },
   
  { label: 'Bill-No', key: 'billNo' },
    { label: 'Track-Waybill', key: 'truckWayBill' },
    { label: 'Doc-Owner', key:'docOwner'},
    { label: 'Shipper', key: 'shipper' },
    { label: 'Transitor', key: 'transitor' }

  ];


    detailHeaders = [
       { label: 'Loading-Date', key: 'loadingDate' },
  { label: 'Djb-Eta', key: 'etadjb' },
  { label: 'Djb-Arr', key: 'djbArrived' },
  { label: 'Doc-Sent-Djb', key: 'docSentDjb' },
  { label: 'Doc-Coll', key: 'docCollected' },
  { label: 'Bill-Coll', key: 'billCollected' },
  { label: 'Tax-Paid', key: 'taxPaid' },
  { label: 'Djb-Departed', key: 'djbDeparted' },
  { label: 'Akk-Arr', key: 'akkArrived' },
  { label: 'Sdt-Arr', key: 'sdtArrived' },
  { label: 'Unreturned-Cont', key: 'empityContainersLeftUnreturned' },
  { label: 'Remark', key: 'remark' }
];

  tableData: any[] = [];

  constructor(
    private historyService: HistoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFollowups();

    // Reload when navigating back
this.router.events
  .pipe(filter(event => event instanceof NavigationEnd))
  .subscribe(() => {
    this.loadFollowups();
  });

  }

  // --- Load data from service ---
  loadFollowups() {
    this.historyService.getHistoryData().subscribe({
      next: (data) => {
        this.tableData = data;
      },
      error: (err) => console.error('Failed to load followups:', err)
    });
  }

  // --- Handle events from reusable table ---
  onAdd(newData: any) {
    const sanitizedData = this.sanitizeData(newData);
    delete (sanitizedData as any).id;
    this.historyService.createHistoryData(sanitizedData).subscribe({
      next: () => this.loadFollowups(),
      error: (err) => console.error('Failed to add:', err)
    });
  }

  onEdit(updatedData: any) {
    this.historyService.updateHistoryData(updatedData.id, updatedData).subscribe({
      next: () => this.loadFollowups(),
      error: (err) => console.error('Failed to update:', err)
    });
  }

  onDelete(rowData: any) {
    this.historyService.deleteHistoryData(rowData.id).subscribe({
      next: () => this.loadFollowups(),
      error: (err) => console.error('Failed to delete:', err)
    });
  }

  // --- Optional: sanitize numeric/date fields ---
  private sanitizeData(data: any) {
    const formatted: any = { ...data };

    ['quantity', 'loadedOnfcl', 'numberofContReturned'].forEach((key) => {
      formatted[key] = Number(formatted[key]) || 0;
    });

    [
      'etadjb','loadingDate','djbArrived','docSentDjb','docCollected','billCollected',
      'taxPaid','djbDeparted','akkArrived','sdtArrived','containerReturned'
    ].forEach((key) => {
      formatted[key] = this.formatDate(formatted[key]);
    });

    return formatted;
  }

  private formatDate(date: string | null | undefined): string | null {
    if (!date) return null;
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? null : parsed.toISOString().split('T')[0];
  }
}
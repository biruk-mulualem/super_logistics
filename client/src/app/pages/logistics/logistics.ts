import { Component, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

import { ReusableTable } from '../../shared/components/reusable-table/reusable-table';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Header } from '../../shared/components/header/header';

import { LogisticsFollowupService } from '../../services/logistics-followup.service';



import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-logistics',
  standalone: true,
  imports: [FormsModule, ReusableTable, Sidebar, Header],
  templateUrl: './logistics.html',
  styleUrls: ['./logistics.css'] 
})
export class Logistics implements OnInit {
tableHeaders = [
  { label: 'id', key: 'id' },
  { label: 'item', key: 'itemDescription' },
  { label: 'Uom', key: 'uom' },
  { label: 'quantity', key: 'quantity' },
  { label: 'No-Cont', key: 'loadedOnfcl' },
  { label: 'Cont-Type', key: 'containerType' },
  { label: 'Loading-Date', key: 'loadingDate' },
  { label: 'B-No', key: 'billNo' },
    { label: 'Track-Waybill', key: 'truckWayBill' },
      { label: 'Doc-Owner', key:'docOwner'},
  { label: 'Shipper', key: 'shipper' },
  { label: 'Transitor', key: 'transitor' },
   { label: 'Djb-Eta', key: 'etadjb' },
  { label: 'Djb-Arr', key: 'djbArrived' },
 { label: 'Doc-Sent-Djb', key: 'docSentDjb' },
  { label: 'Doc-Coll', key: 'docCollected' },
   { label: 'Bill-Coll', key: 'billCollected' },
    { label: 'Tax-Paid', key: 'taxPaid' },
  { label: 'Djb-Departed', key: 'djbDeparted' },
  { label: 'Akk-Arr', key: 'akkArrived' },
  { label: 'Sdt-Arr', key: 'sdtArrived' },
  { label: 'Cont-Returned', key: 'numberofContReturned' },
  { label: 'Remark', key: 'remark' }
];


  tableData: any[] = [];

  constructor(
    
    
    private logisticsService: LogisticsFollowupService,
      private router: Router
  
  ) {}

ngOnInit() {
  this.loadFollowups(); // Initial load

  // Re-load when navigating back to this route
  this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      if (event.urlAfterRedirects === '/logistics') {
        this.loadFollowups();
      }
    });
}


  loadFollowups() {
    this.logisticsService.getFollowups().subscribe({
      next: (data) => {
        console.log('✅ Data fetched from API:', data);
        this.tableData = data;
      },
      error: (err) => {
        console.error('❌ Failed to load followups:', err);
      }
    });
  }
}

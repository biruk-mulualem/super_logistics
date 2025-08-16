import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  addData: any = {};      // Bind this to your modal form
  showAddModal = false;    // Control modal visibility

  constructor(
    private logisticsService: LogisticsFollowupService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFollowups();

    // Reload when navigating back
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.loadFollowups());
  }

  // --- Load data from backend ---
  loadFollowups() {
    this.logisticsService.getLogisticsData().subscribe({
      next: (data) => {
        this.tableData = data;
      },
      error: (err) => console.error('Failed to load followups:', err)
    });
  }

  // --- Handle edit ---
  onEdit(updatedData: any) {
    this.logisticsService.updateLogisticsData(updatedData.id, updatedData).subscribe({
      next: () => this.loadFollowups(),
      error: (err) => console.error('Failed to update:', err)
    });
  }

  // --- Handle delete ---
  onDelete(rowData: any) {
    this.logisticsService.deleteLogisticsData(rowData.id).subscribe({
      next: () => this.loadFollowups(),
      error: (err) => console.error('Failed to delete:', err)
    });
  }

  


}

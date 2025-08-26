import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LogisticsFollowupService } from '../../services/logistics-followup.service';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { ReusableTable } from '../../shared/components/reusable-table/reusable-table';
import { firstValueFrom } from 'rxjs';

@Component({
  imports: [Header, Sidebar, ReusableTable],
  selector: 'app-logistics',
  templateUrl: './logistics.html',
  styleUrls: ['./logistics.css'],
})
export class Logistics implements OnInit {
  logisticsHeaders = [
    { label: 'Id', key: 'id' },
    { label: 'No-Cont', key: 'loadedOnfcl' },
    { label: 'Cont-Type', key: 'containerType' },
    { label: 'Bill-No', key: 'billNo' },
    { label: 'Track-Waybill', key: 'truckWayBill' },
    { label: 'Doc-Owner', key: 'docOwner' },
    { label: 'Shipper', key: 'shipper' },
    { label: 'Transitor', key: 'transitor' },
  ];

  tableData: any[] = [];

  addData: any = {
    LoadedOnfcl: '',
    containerType: '',
    remark: '',
    items: [
      {
        transactionId: '',
        selectedItem: null,
        itemDescription: '',
        uom: '',
        quantity: 0,
        LoadedQnty: 0,
        availableItems: [],
      },
    ],
  };

  editData: any = {};
  showEditModal = false;
  intransitOptions: any[] = []; // options from backend

  constructor(
    private logisticsService: LogisticsFollowupService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchIntransitOptions();
  }

  fetchIntransitOptions() {
    this.logisticsService.getIntransitDataForLogistics().subscribe({
      next: (res) => (this.intransitOptions = res),
      error: (err) => console.error(err),
    });
  }

  // ---------------- Transaction / Item Changes ----------------
  onTransactionChange(item: any) {
    const trx = this.intransitOptions.find(t => t.transactionId === item.transactionId);
    item.availableItems = trx ? trx.items : [];
    item.selectedItem = null;
    item.itemDescription = '';
    item.uom = '';
    item.quantity = 0;
    item.LoadedQnty = 0;
  }

  onItemChange(item: any) {
    const selected = item.selectedItem;
    if (selected) {
      item.itemDescription = selected.itemDescription;
      item.uom = selected.uom;
      item.quantity = selected.quantity;
      item.LoadedQnty = 0;
    } else {
      item.uom = '';
      item.quantity = 0;
      item.LoadedQnty = 0;
    }
  }



  onRemoveLogistics(index: number) {
    if (this.addData.items?.length > index) {
      this.addData.items.splice(index, 1);
      this.cdr.detectChanges();
    }
  }

  onLoadedQntyInput(event: Event, item: any) {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value, 10);
    if (isNaN(value) || value < 0) value = 0;
    if (value > item.quantity) value = item.quantity;
    item.LoadedQnty = value;
    input.value = String(value);
  }

  // ---------------- Save Logistics (using your subscription) ----------------


  resetAddData() {
    this.addData = {
      LoadedOnfcl: '',
      containerType: '',
      remark: '',
      items: [
        {
          transactionId: '',
          selectedItem: null,
          itemDescription: '',
          uom: '',
          quantity: 0,
          LoadedQnty: 0,
          availableItems: [],
        },
      ],
    };
  }

  // ---------------- Edit / Delete / Payment ----------------
  saveLogisticsEdit(event: any) {
    this.editData = event;
  }

  onLogisticsDelete(event: any) {
    const idx = this.tableData.findIndex(row => row.id === event.id);
    if (idx > -1) this.tableData.splice(idx, 1);
  }

  saveLogisticsPayment(event: any) {
    console.log('Payment saved:', event);
  }

  



onAddLogistics(payload: any) {
  console.log("Received payload from child:", payload);

  if (!payload || !payload.items || payload.items.length === 0) {
    alert("No items to save.");
    return;
  }

  this.logisticsService.addLogistics(payload).subscribe({
    next: res => {
      console.log('✅ Logistics saved successfully:', res);

      // Add new row to table for UI
      const newId = this.tableData.length + 1;
      this.tableData.push({
        id: newId,
        loadedOnfcl: payload.LoadedOnfcl,
        containerType: payload.containerType,
        remark: payload.remark,
        items: payload.items.map((i: any) => ({
          transactionId: i.transactionId,
          itemDescription: i.itemDescription,
          uom: i.uom,
          quantity: i.LoadedQnty || i.quantity
        }))
      });

      // Reset modal data
      this.resetAddData();
    },
    error: err => {
      console.error('❌ Failed to save logistics:', err);
      alert('Failed to save logistics.');
    }
  });
}
































}

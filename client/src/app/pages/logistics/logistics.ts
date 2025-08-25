import { Component, OnInit } from '@angular/core';
import { LogisticsFollowupService } from '../../services/logistics-followup.service';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { ReusableTable } from '../../shared/components/reusable-table/reusable-table';

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

  logisticsData = [
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
    { label: 'Remark', key: 'remark' },
  ];

  tableData: any[] = [];
  editDataForChild: any = {};
  showEditModal = false;

  addData: any = {
    items: [
      {
        transactionId: '',
        itemDescription: '',
        uom: '',
        LoadedQnty: '',
        totalQuantity: '',
        availableItems: [],
      },
    ],
  };

  intransitOptions: any[] = []; // all TransactionIds + Items from backend
  editData: any;

  constructor(private logisticsService: LogisticsFollowupService) {}

  ngOnInit(): void {
    this.fetchIntransitOptions();
  }

  fetchIntransitOptions() {
    this.logisticsService.getIntransitDataForLogistics().subscribe({
      next: (res) => (this.intransitOptions = res),
      error: (err) => console.error(err),
    });
  }

  onTransactionChange(row: any) {
    const trx = this.intransitOptions.find(
      (t) => t.transactionId === row.transactionId
    );
    row.availableItems = trx ? trx.items : [];
    row.itemDescription = '';
    row.uom = '';
    row.totalQuantity = '';
    row.LoadedQnty = '';
  }

  onItemChange(row: any) {
    const selected = row.availableItems.find(
      (i: { itemDescription: any }) => i.itemDescription === row.itemDescription
    );
    if (selected) {
      row.uom = selected.uom;
      row.totalQuantity = selected.quantity;
      row.LoadedQnty = '';
    } else {
      row.uom = '';
      row.totalQuantity ='';
    }
  }

  // ------------------- Methods called from logistics.html -------------------
onAddLogistics() {
  if (!this.editData.items) this.editData.items = [];
  this.editData.items.push({
    itemDescription: '',
    quantity: '',
    unitPrice: '',
    uom: '',
    loadedQnty: '',
    remainingQnty: ''
  });
}

 onRemoveLogistics(index: number) {
  if (this.editData.items && this.editData.items.length > 1) {
    this.editData.items.splice(index, 1);
  }
}


  saveLogisticsEdit(event: any) {
    this.editDataForChild = event;
    // optionally update tableData here
  }

  onLogisticsDelete(event: any) {
    const idx = this.tableData.findIndex((row) => row.id === event.id);
    if (idx > -1) this.tableData.splice(idx, 1);
  }

  saveLogisticsPayment(event: any) {
    console.log('Logistics payment saved:', event);
  }

  closeLogisticsEditModal() {
    this.showEditModal = false;
  }
}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { ReusableTable } from '../../shared/components/reusable-table/reusable-table';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { LogisticsFollowupService } from '../../services/services/logistics/logistics-followup.service';

@Component({
  imports: [Header, Sidebar, ReusableTable],
  selector: 'app-logistics',
  templateUrl: './logistics.html',
  styleUrls: ['./logistics.css'],
})
export class Logistics implements OnInit {
  logisticsHeaders = [
    { label: 'Id', key: 'id' },
     { label: 'Ref NO.', key: 'transactionId' },
      { label: 'Bill-No', key: 'billNo' },
   
    { label: 'No-Cont', key: 'loadedOnfcl' },
    { label: 'Cont-Type', key: 'containerType' },
  
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
    private cdr: ChangeDetectorRef,
      private route: ActivatedRoute
  ) {}

  // ngOnInit(): void {
  //   this.fetchIntransitOptions();
  //   this.loadLogisticsData();
  // }


ngOnInit() {
  const data = this.route.snapshot.data['tableData'] || {};
  this.tableData = data.logistics || [];
  this.intransitOptions = data.intransitOptions || [];
}



  fetchIntransitOptions() {
    this.logisticsService.getIntransitDataForLogistics().subscribe({
      next: (res) => (this.intransitOptions = res),
      error: (err) => console.error(err),
    });
  }

  // ---------------- Transaction / Item Changes ----------------
  onTransactionChange(item: any) {
    const trx = this.intransitOptions.find(
      (t) => t.transactionId === item.transactionId
    );
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

    onDelete(rowData: any) {
    this.logisticsService.deleteIntransitData(rowData.id).subscribe({
      next: () => this.loadLogisticsData(), 
      error: (err) => console.error('Failed to delete:', err)
    });
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



  private toPascalCase(obj: any): any {
    if (Array.isArray(obj))
      return obj.map((item: any) => this.toPascalCase(item));
    if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
        acc[pascalKey] = this.toPascalCase(obj[key]);
        return acc;
      }, {} as any);
    }
    return obj;
  }

  // Usage in your save method
  saveLogisticsEdit(updatedRow: any) {
    const payload = this.toPascalCase(updatedRow);
    const parentId = payload.Id; // <-- use PascalCase Id

    this.logisticsService
      .updateLogisticsDetailData(parentId, payload)
      .subscribe({
        next: (res) => {
          console.log('Logistics updated successfully', res);
          const idx = this.tableData.findIndex((r) => r.id === parentId);
          if (idx > -1) this.tableData[idx] = updatedRow;
        },
        error: (err) => console.error('Failed to update logistics:', err),
      });
  }


  onAddLogistics(payload: any) {
    

    if (!payload || !payload.items || payload.items.length === 0) {
      alert('No items to save.');
      return;
    }

    this.logisticsService.addLogistics(payload).subscribe({
      next: (res) => {
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
            quantity: i.LoadedQnty || i.quantity,
          })),
        });

        // Reset modal data
        this.resetAddData();
      },
      error: (err) => {
        console.error('❌ Failed to save logistics:', err);
        alert('Failed to save logistics.');
      },
    });
  }

  // loadLogisticsData() {
  //   this.logisticsService.getLogisticsData().subscribe({
  //     next: (data) => {
    
  //       this.tableData = data;
  //     },
  //     error: (err) => {
  //       console.error('❌ Error fetching data:', err);
  //     },
  //   });
  // }


loadLogisticsData() {
  this.logisticsService.getLogisticsData().subscribe({
    next: (data) => {
      console.log("📦 Full Logistics Data received:", data);
      this.tableData = data || [];
    },
    error: (err) => {
      console.error('❌ Error fetching data:', err);
      this.tableData = [];
    }
  });
}


}

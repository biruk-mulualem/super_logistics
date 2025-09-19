import { Component, OnInit } from '@angular/core';
import { Header } from '../../../shared/components/header/header';

import { ReusableTable } from '../../../shared/components/reusable-table/reusable-table';

import { firstValueFrom } from 'rxjs';



import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { LogisticsFollowupService } from '../../../services/services/logistics/logistics-followup.service';
@Component({
  selector: 'app-donelogistics-history',
 imports: [Header, ReusableTable],
  templateUrl: './donelogistics-history.html',
  styleUrl: './donelogistics-history.css'
})
// export class DonelogisticsHistory implements OnInit {
export class DonelogisticsHistory  {
 tableHeaders = [
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

  constructor(private logisticsService: LogisticsFollowupService,
       private route: ActivatedRoute

  ) {}

  // ngOnInit(): void {
  //   this.loadFollowups();
  // }
ngOnInit() {
  const data = this.route.snapshot.data['tableData'] || { tableData: [] };
  this.tableData = data.tableData || [];
}



   async loadFollowups() {
    try {
      const data = await firstValueFrom(this.logisticsService.getLogisticsStatus1Data());
      if (!data) { this.tableData = []; return; }

      const tableWithDetails = await Promise.all(
        data.map(async row => {
          const [items] = await Promise.all([
            firstValueFrom(this.logisticsService.getLogisticsItemsDetailStatus1Data(row.transactionId))
       
          ]);
          return { ...row, items };
        })
      );

      this.tableData = tableWithDetails;
    } catch (err) {
      console.error('Failed to load followups:', err);
      this.tableData = [];
    }
  }

}

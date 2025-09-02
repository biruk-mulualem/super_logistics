import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { LogisticsFollowupService } from '../../../services/logistics/logistics-followup.service';


@Injectable({
  providedIn: 'root'
})
export class LogisticsDoneResolverService implements Resolve<any> {
  constructor(
    private  service: LogisticsFollowupService

  
  ) {}

async resolve() {
  try {
    const logistics = await firstValueFrom(this.service.getLogisticsStatus1Data());

    const tableWithItems = await Promise.all(
      logistics.map(async row => {
        const items = await firstValueFrom(this.service.getLogisticsItemsDetailStatus1Data(row.transactionId));
        return { ...row, items };
      })
    );

    return { tableData: tableWithItems };
  } catch (err) {
    console.error('Resolver failed:', err);
    return { tableData: [] };
  }
}







}

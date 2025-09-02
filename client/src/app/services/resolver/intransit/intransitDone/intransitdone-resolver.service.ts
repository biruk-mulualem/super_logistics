import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { IntransitFollowupService } from '../../../services/intransit/intransit-followup.service';

@Injectable({
  providedIn: 'root'
})
export class IntransitDoneResolverService implements Resolve<any> {
  constructor(
    private intransitservice: IntransitFollowupService
,
  
  ) {}

  async resolve() {
    const data = await firstValueFrom(this.intransitservice.getIntransitStatus1Data());
    
    const tableWithDetails = await Promise.all(
      data.map(async row => {
        const [items, payments] = await Promise.all([
          firstValueFrom(this.intransitservice.getIntransitItemsDetailData(row.transactionId)),
          firstValueFrom(this.intransitservice.getPaymentData(row.transactionId))
        ]);
        return { ...row, items, payments };
      })
    );

    return tableWithDetails;
  }






}

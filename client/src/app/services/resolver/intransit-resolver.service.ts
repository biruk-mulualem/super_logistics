import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { IntransitFollowupService } from '../intransit-followup.service';


@Injectable({
  providedIn: 'root'
})
export class IntransitResolverService implements Resolve<any> {
  constructor(private service: IntransitFollowupService) {}

  async resolve() {
    const data = await firstValueFrom(this.service.getIntransitData());
    
    const tableWithDetails = await Promise.all(
      data.map(async row => {
        const [items, payments] = await Promise.all([
          firstValueFrom(this.service.getIntransitItemsDetailData(row.transactionId)),
          firstValueFrom(this.service.getPaymentData(row.transactionId))
        ]);
        return { ...row, items, payments };
      })
    );

    return tableWithDetails;
  }
}

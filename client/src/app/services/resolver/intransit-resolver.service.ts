import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { IntransitFollowupService } from '../intransit-followup.service';
import { LogisticsFollowupService } from '../logistics-followup.service';


@Injectable({
  providedIn: 'root'
})
export class IntransitResolverService implements Resolve<any> {
  constructor(
    private intransitService: IntransitFollowupService,
    private logisticsService: LogisticsFollowupService   // 👈 inject logistics service
  ) {}

  async resolve() {
    // 🔹 Get Intransit Data with items + payments
    const intransitData = await firstValueFrom(this.intransitService.getIntransitData());

    const intransitWithDetails = await Promise.all(
      intransitData.map(async row => {
        const [items, payments] = await Promise.all([
          firstValueFrom(this.intransitService.getIntransitItemsDetailData(row.transactionId)),
          firstValueFrom(this.intransitService.getPaymentData(row.transactionId))
        ]);
        return { ...row, items, payments };
      })
    );

    // 🔹 Get Logistics Data
    const logisticsData1 = await firstValueFrom(this.logisticsService.getIntransitDataForLogistics());
    // 🔹 Get Logistics Data
    const logisticsData = await firstValueFrom(this.logisticsService.getLogisticsData());
    // ✅ Return both
    return {
      intransit: intransitWithDetails,
      logistics: logisticsData
    };
  }
}

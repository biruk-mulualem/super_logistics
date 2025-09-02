import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { LogisticsFollowupService } from '../../../services/logistics/logistics-followup.service';




@Injectable({
  providedIn: 'root'
})
export class LogisticsResolverService implements Resolve<any> {
  constructor(private service: LogisticsFollowupService) {}

  async resolve() {
    // Fetch all logistics rows
    const logistics = await firstValueFrom(this.service.getLogisticsData());

    // Fetch all intransit options for dropdowns
    const intransitOptions = await firstValueFrom(
      this.service.getIntransitDataForLogistics()
    );

    // Return both so component can use them
    return { logistics, intransitOptions };
  }
}








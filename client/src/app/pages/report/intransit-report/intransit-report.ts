import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../shared/components/header/header';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-intransit-report',
  standalone: true,
  imports: [Header, Sidebar, FormsModule],
  templateUrl: './intransit-report.html',
  styleUrls: ['./intransit-report.css'],
})
export class IntransitReport {
filters = {
  status: '',
  customer: '',
  location: '',
  deliveryType: '',
  startDate: '',
  endDate: ''
};


  fetchAndPrint() {
    console.log('Fetching report with filters:', this.filters);

    // TODO: Call your service to fetch filtered data
    // e.g., this.reportService.getFilteredData(this.filters).subscribe(...)
  }
}

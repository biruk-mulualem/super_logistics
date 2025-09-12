import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

import { Header } from '../../../shared/components/header/header';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-logistics-report',
 imports: [Sidebar,Header,FormsModule],
  templateUrl: './logistics-report.html',
  styleUrl: './logistics-report.css'
})
export class LogisticsReport {

}

import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

import { Header } from '../../../shared/components/header/header';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logistics-report',
imports: [Sidebar, Header, FormsModule,CommonModule],

  templateUrl: './logistics-report.html',
  styleUrl: './logistics-report.css'
})
export class LogisticsReport {

  
  reportData: any[] = []; // Store fetched report data

filters = {
  transactionId: '',
  billNo: '',
  shipper: '',
  transitor: '',
  origin: '',
  containerType: '',
  etaStart: '',
  etaEnd: '',
  loadingStart: '',
  DocSentDJB: '',
  status: '',
  docOwner: '',
  truckWayBill: '',
  billCollected: '',
  taxPaid: ''
};

  containerTypes = ['20ft', '40ft', '45ft_HC', 'Open Top', 'Flat Rack'];


     origins: string[] = [
    'china', 'india', 'usa', 'germany', 'japan', 'south_korea', 
    'france', 'uk', 'italy', 'canada', 'mexico', 'brazil', 
    'russia', 'turkey', 'australia', 'singapore', 'netherlands', 
    'belgium', 'switzerland', 'uae', 'thailand', 'vietnam', 
    'malaysia', 'indonesia'
  ];


fetchAndPrint() {
  
}
}

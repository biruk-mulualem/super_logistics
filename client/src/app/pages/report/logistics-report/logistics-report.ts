import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

import { Header } from '../../../shared/components/header/header';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogisticsReportsService } from '../../../services/services/report/LogisticsReport/logistics-reports.service';

@Component({
  selector: 'app-logistics-report',
imports: [Sidebar, Header, FormsModule,CommonModule],

  templateUrl: './logistics-report.html',
  styleUrl: './logistics-report.css'
})
export class LogisticsReport {

  constructor(private reportService: LogisticsReportsService) {}

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

  containerTypes = ['20ft', '40ft', '45ft_HC', 'Open_Top', 'Flat_Rack'];


     origins: string[] = [
    'china', 'india', 'usa', 'germany', 'japan', 'south_korea', 
    'france', 'uk', 'italy', 'canada', 'mexico', 'brazil', 
    'russia', 'turkey', 'australia', 'singapore', 'netherlands', 
    'belgium', 'switzerland', 'uae', 'thailand', 'vietnam', 
    'malaysia', 'indonesia'
  ];



fetchAndPrint() {
  const payload: Partial<typeof this.filters> = {};
  Object.entries(this.filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      payload[key as keyof typeof this.filters] = value;
    }
  });

  this.reportService.GetReportData(payload).subscribe({
    next: (data) => {
      this.reportData = data.map((t: any) => {
        // Create stacks for transaction-level arrays
        t.djbDepartedStack = t.djbDeparted?.length
          ? t.djbDeparted.map((d: any) => `${d.numberOfContainer} (${d.date})`).join('\n')
          : '-';

        t.containerReturnedStack = t.containerReturned?.length
          ? t.containerReturned.map((c: any) => `${c.numberOfContainer} (${c.date})`).join('\n')
          : '-';

        t.arrivedAAKStack = t.arrivedAAK?.length
          ? t.arrivedAAK.map((a: any) => `${a.numberOfContainer} (${a.date})`).join('\n')
          : '-';

        t.arrivedSDTStack = t.arrivedSDT?.length
          ? t.arrivedSDT.map((s: any) => `${s.numberOfContainer} (${s.date})`).join('\n')
          : '-';

        return t;
      });
    },
    error: (err) => console.error('Error fetching logistics data:', err)
  });
}


















printReport() {
  const table = document.getElementById('reportTable');
  if (!table) return;

  const popupWin = window.open('', '_blank', 'width=1200,height=800');
  if (!popupWin) return;

  popupWin.document.open();
  popupWin.document.write(`
    <html>
      <head>
        <title>Super Double T General Trading Plc - Logistics Report</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            font-size: 12px; 
            margin: 20px; 
          }
          h1 { 
            text-align: center; 
            font-size: 20px; 
            margin-bottom: 5px; 
            color: #ff0000; 
          }
          h2 { 
            text-align: center; 
            font-size: 16px; 
            margin-bottom: 20px; 
            color: #0440f5; 
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            table-layout: auto; /* allow columns to expand */
          }
          th, td { 
            border: 1px solid #030303ff; 
            padding: 5px; 
            text-align: center;
            font-size: 14px; 
            white-space: nowrap; /* prevents text wrapping */
          }
          th { 
            background-color: #0440f5ff; 
            color: black; 
            font-weight: 500; 
            font-size: 15px; 
          }
          tbody tr:nth-child(even) { background-color: #f3f3f3; }
        </style>
      </head>
      <body onload="window.print(); window.close();">
        ${table.outerHTML}
      </body>
    </html>
  `);
  popupWin.document.close();
}























}

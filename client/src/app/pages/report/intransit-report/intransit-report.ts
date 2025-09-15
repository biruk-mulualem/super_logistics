import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../shared/components/header/header';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { IntransitReportService } from '../../../services/services/report/IntransitReport/intransit-report.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-intransit-report',
  standalone: true,
  imports: [Header, Sidebar, FormsModule,CommonModule],
  templateUrl: './intransit-report.html',
  styleUrls: ['./intransit-report.css'],
})
export class IntransitReport {

  reportData: any[] = []; // Store fetched report data

  filters = {
    transactionId: '',
    purchaseOrder: '',
    startDate: '',
    endDate: '',
     origin: '',
    status: '',
  };

     origins: string[] = [
    'china', 'india', 'usa', 'germany', 'japan', 'south_korea', 
    'france', 'uk', 'italy', 'canada', 'mexico', 'brazil', 
    'russia', 'turkey', 'australia', 'singapore', 'netherlands', 
    'belgium', 'switzerland', 'uae', 'thailand', 'vietnam', 
    'malaysia', 'indonesia'
  ];

  constructor(private reportService: IntransitReportService) {}
fetchAndPrint() {
  console.log('Fetching report with filters:', this.filters);

  const payload: any = {};
  Object.keys(this.filters).forEach(key => {
    const value = this.filters[key as keyof typeof this.filters];
    if (value !== null && value !== undefined && value !== '') {
      payload[key] = value;
    }
  });

  this.reportService.GetReportData(payload).subscribe({
    next: (data) => {
      // First, find the maximum number of payments in any report
      const maxPayments = Math.max(
        ...data.map((f: any) => f.payments?.length ?? 0),
        2 // minimum 2 columns for display
      );

      // Normalize payments for each report
      this.reportData = data.map((followup: any) => {
        const payments = followup.payments ?? [];
        const normalizedPayments = [];

        for (let i = 0; i < maxPayments; i++) {
          if (payments[i]) {
            const amount = payments[i].amountPaid ?? 0;
            const percent = followup.totalPrice
              ? (amount / followup.totalPrice) * 100
              : 0;
            normalizedPayments.push({ Amount: amount, Percent: percent });
          } else {
            normalizedPayments.push({ Amount: 0, Percent: 0 });
          }
        }

        followup.normalizedPayments = normalizedPayments;

        // Totals from followup table
        followup.TotalAmountPaid = followup.totalAmountPaid ?? 0;
        followup.TotalPaidInPercent = followup.totalPaidInPercent ?? 0;
        followup.TotalAmountRemaning = followup.totalAmountRemaning ?? followup.totalPrice ?? 0;
        followup.TotalRemaningInPercent = followup.totalRemaningInPercent ?? 100;

        return followup;
      });

      console.log('Processed report data:', this.reportData);
    },
    error: (err) => {
      console.error('Error fetching report:', err);
    }
  });
}


// Helper method to determine max payments across all reports
getMaxPayments(reportData: any[]): number[] {
  if (!reportData || reportData.length === 0) return []; // handle empty report
  const max = Math.max(...reportData.map(r => r.normalizedPayments?.length ?? 0), 0);
  return Array.from({ length: max }, (_, i) => i);
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
        <title>Super Double T General Trading Plc - Intransit Report</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; margin: 20px; }
          h1 { text-align: center; font-size: 20px; margin-bottom: 5px; color: #ff0000; } /* header color */
          h2 { text-align: center; font-size: 16px; margin-bottom: 20px; color: #0440f5; } /* subheader color */
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #030303ff; padding: 5px; text-align: center; }
          th { background-color: #0440f5ff; color: black; font-weight: 700; }
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

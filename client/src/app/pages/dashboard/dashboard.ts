import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { firstValueFrom } from 'rxjs';

import { Header } from '../../shared/components/header/header';
import { DashboardService } from '../../services/services/dashboard/dashboard.service';
import { ContainerTracker } from '../../shared/components/container-tracker/container-tracker';
import { Calander } from '../../shared/components/calander/calander';
import { Chatbot } from '../../shared/components/chatbot/chatbot';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [
    Header,
    FormsModule,
    CommonModule,
    ContainerTracker,
    Calander,
    Chatbot,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  // Payment stats
  advancePayment = 0;
  pendingPayment = 0;
  fullPayment = 0;
  totalItems = 0;
  // Shipment stats
  inRoute = 0;
  inDjibouti = 0;
  inAak = 0;
  inSdt = 0;
  totalContainers = 0;
  fikaduDocuments = 0;
  shimelisDocuments = 0;
  superDocuments = 0;
  othersDocuments = 0;
  containers20ft = 0;
  containers40ft = 0;
  containers45ftHC = 0;
  containersFromChina = 0;
  containersFromIndia = 0;
  containersFromUAE = 0;
  containersFromEgypt = 0;
  billNotCollected = 0;
  taxNotPaid = 0;
  docNotCollected = 0;
  docNotSentDjb = 0;
   reminders: { message: string }[] = []; // ✅ Declare and initialize


  constructor(private dashboardService: DashboardService) {}
  // -------------------- Initialization --------------------
  ngOnInit(): void {
    this.LoadIntransitRelatedData();
    this.LoadLogisticsRelatedData();
      this.getReminderAndAlerts();
  }
  // -------------------- Load Data Methods --------------------
  async LoadIntransitRelatedData() {
    try {
      const data = await firstValueFrom(
        this.dashboardService.getIntransitRelatedData()
      );
      const payload: any = Array.isArray(data) ? data[0] ?? {} : data ?? {};

      this.advancePayment =
        payload.AdvancePayment ?? payload.advancePayment ?? 0;
      this.pendingPayment =
        payload.PendingPayment ?? payload.pendingPayment ?? 0;
      this.fullPayment = payload.FullPayment ?? payload.fullPayment ?? 0;
      this.totalItems = payload.TotalItems ?? payload.totalItems ?? 0;
    } catch (error) {
      console.error('❌ Error loading payments:', error);
    }
  }
  async LoadLogisticsRelatedData() {
    try {
      const stats = await firstValueFrom(
        this.dashboardService.getLogisticsRelatedData()
      );
      this.inRoute = stats.inRoute;
      this.inDjibouti = stats.inDjibouti;
      this.inAak = stats.inAak;
      this.inSdt = stats.inSdt;
      this.totalContainers = stats.totalContainers;
      this.fikaduDocuments = stats.fikaduDocuments;
      this.shimelisDocuments = stats.shimelisDocuments;
      this.superDocuments = stats.superDocuments;
      this.othersDocuments = stats.othersDocuments;
      this.containers20ft = stats.containers20ft;
      this.containers40ft = stats.containers40ft;
      this.containers45ftHC = stats.containers45ftHC;
      this.containersFromChina = stats.containersFromChina;
      this.containersFromIndia = stats.containersFromIndia;
      this.containersFromUAE = stats.containersFromUAE;
      this.containersFromEgypt = stats.containersFromEgypt;
      this.billNotCollected = stats.billNotCollected;
      this.taxNotPaid = stats.taxNotPaid;
      this.docNotCollected = stats.docNotCollected;
      this.docNotSentDjb = stats.docNotSentDjb;
    } catch (err) {
      console.error('❌ Error loading InRoute stats:', err);
    }
  }



getReminderAndAlerts() {
  this.dashboardService.getReminderAndAlertsData().subscribe({
    next: (data) => {
      console.log("📢 API Reminder Data:", data);

      this.reminders = [
        ...(data.overpaid || []).map((msg: string) => ({ message: msg })),
        ...(data.fullyPaidButUnloaded || []).map((msg: string) => ({ message: msg })),
        ...(data.etaDjiboutiPassed || []).map((msg: string) => ({ message: msg })), // match API key   
          ...(data.containersNotDepartedYet || []).map((msg: string) => ({ message: msg })), // match API key
      ];

      console.log("✅ Processed Reminders:", this.reminders);
    },
    error: (err) => console.error("❌ Reminder API Error:", err)
  });
}

}

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
  constructor(private dashboardService: DashboardService) {}
  // -------------------- Initialization --------------------
  ngOnInit(): void {
    this.loadFollowups();
    this.loadInRouteStats();
  }
  // -------------------- Load Data Methods --------------------
async loadFollowups() {
  try {
    const data = await firstValueFrom(this.dashboardService.getPaymentData());
    const payload: any = Array.isArray(data) ? data[0] ?? {} : data ?? {};

    this.advancePayment = payload.AdvancePayment ?? payload.advancePayment ?? 0;
    this.pendingPayment = payload.PendingPayment ?? payload.pendingPayment ?? 0;
    this.fullPayment = payload.FullPayment ?? payload.fullPayment ?? 0;
    this.totalItems = payload.TotalItems ?? payload.totalItems ?? 0;

  } catch (error) {
    console.error('❌ Error loading payments:', error);
  }
}

  async loadInRouteStats() {
    try {
      const stats = await firstValueFrom(
        this.dashboardService.getInRouteDjbAakSdtData()
      );

      this.inRoute = stats.inRoute;
      this.inDjibouti = stats.inDjibouti;
      this.inAak = stats.inAak;
      this.inSdt = stats.inSdt;
    } catch (err) {
      console.error('❌ Error loading InRoute stats:', err);
    }
  }
}

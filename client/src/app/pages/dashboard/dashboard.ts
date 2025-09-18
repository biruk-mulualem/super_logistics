import { Component, ViewChild, ElementRef, AfterViewChecked, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Header } from '../../shared/components/header/header';
import { ChatbotService } from '../../services/chatbot/chatbot.service';
import { DashboardService } from '../../services/services/dashboard/dashboard.service';
import EthiopianCalendar from 'ethiopian-calendar-new';
import { toEthiopian } from 'ethiopian-calendar-new';
import { ContainerTracker } from '../../shared/components/container-tracker/container-tracker';
import { Calander } from '../../shared/components/calander/calander';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [Sidebar, Header, FormsModule, CommonModule, HttpClientModule,ContainerTracker,Calander],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements AfterViewChecked, OnInit {
  @ViewChild('chatBody') private chatBody!: ElementRef;

  // Chat
  isChatOpen = false;
  chatInput = '';
  messages: { from: 'user' | 'bot'; text: string }[] = [];
  isSending = false;
  isBotTyping = false;

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

  // Calendar
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  days: (Date | null)[] = [];
  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(
    private chatbotService: ChatbotService,
    private cdr: ChangeDetectorRef,
    private dashboardService: DashboardService
  ) {}

  // -------------------- Chat Methods --------------------
  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    try {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    } catch (err) {}
  }

  sendMessage() {
    const input = this.chatInput.trim();
    if (!input) return;

    this.messages.push({ from: 'user', text: input });
    this.chatInput = '';
    this.isBotTyping = true;
    this.isSending = true;
    this.cdr.detectChanges();

    this.chatbotService.sendMessageToApi(input).subscribe(
      (res) => {
        this.messages.push({ from: 'bot', text: res.response });
        this.isBotTyping = false;
        this.isSending = false;
        this.cdr.detectChanges();
      },
      (err) => {
        this.messages.push({ from: 'bot', text: 'Sorry, something went wrong.' });
        this.isBotTyping = false;
        this.isSending = false;
        this.cdr.detectChanges();
      }
    );
  }

  // -------------------- Calendar Methods --------------------
  generateCalendar(year: number, month: number) {
    this.days = [];
    const lastDay = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= lastDay; i++) {
      this.days.push(new Date(year, month, i));
    }
  }

  getTodayEthiopianDate(): string {
    const today = new Date();
    const eth = EthiopianCalendar.toEthiopian(today.getFullYear(), today.getMonth() + 1, today.getDate());
    return `${eth.day}/${eth.month}/${eth.year}`;
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar(this.currentYear, this.currentMonth);
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar(this.currentYear, this.currentMonth);
  }

  isToday(date: Date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  // -------------------- Initialization --------------------
  ngOnInit(): void {
    this.loadFollowups();
    this.loadInRouteStats();

    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.generateCalendar(this.currentYear, this.currentMonth);
    this.cdr.detectChanges();
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
      const stats = await firstValueFrom(this.dashboardService.getInRouteDjbAakSdtData());

      this.inRoute = stats.inRoute;
      this.inDjibouti = stats.inDjibouti;
      this.inAak = stats.inAak;
      this.inSdt = stats.inSdt;
    } catch (err) {
      console.error('❌ Error loading InRoute stats:', err);
    }
  }
}

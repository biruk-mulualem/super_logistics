import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Header } from '../../shared/components/header/header';
import { HttpClientModule } from '@angular/common/http';
import { ChatbotService } from '../../services/chatbot/chatbot.service';
import { DashboardService } from '../../services/services/dashboard/dashboard.service';
import { firstValueFrom } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [Sidebar, Header, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements AfterViewChecked, OnInit {
  @ViewChild('chatBody') private chatBody!: ElementRef;

  isChatOpen = false;
  chatInput = '';
  messages: { from: 'user' | 'bot'; text: string }[] = [];
  isSending = false; // To handle when the bot is processing the request
  isBotTyping = false; // To show the typing indicator
  advancePayment = 0;
  pendingPayment = 0;
  fullPayment = 0;
  totalItems = 0;

    inRoute = 0;
inDjibouti = 0;
inAak = 0;
inSdt = 0;


  constructor(
    private chatbotService: ChatbotService,
    private cdr: ChangeDetectorRef,
    private dashboardService: DashboardService
  ) {}

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    try {
      this.chatBody.nativeElement.scrollTop =
        this.chatBody.nativeElement.scrollHeight;
    } catch (err) {
      // Ignore if chatBody is not yet available
    }
  }

  ngOnInit(): void {
    this.loadFollowups();
    this.loadInRouteStats();
  }




  async loadFollowups() {
    try {
      const data = await firstValueFrom(this.dashboardService.getPaymentData());

      // Support both array responses and single-object responses:
      const payload: any = Array.isArray(data) ? data[0] ?? {} : data ?? {};

      // Accept either PascalCase or camelCase keys and default to 0 if missing
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




async loadInRouteStats() {
  console.log('🔹 loadInRouteStats() called'); // check if method runs
  try {
    const stats = await firstValueFrom(
      this.dashboardService.getInRouteDjbAakSdtData()
    );

    console.log('🔹 HTTP Response:', stats);

this.inRoute = stats.inRoute;
this.inDjibouti = stats.inDjibouti;
this.inAak = stats.inAak;
this.inSdt = stats.inSdt;

    // console.log('✅ Stats assigned to component variables:', {
    //   inRoute: this.inRoute,
    //   inDjibouti: this.inDjibouti,
    //   inAak: this.inAak,
    //   inSdt: this.inSdt,
    // });
  } catch (err) {
    console.error('❌ Error loading InRoute stats:', err);
  }
}






  sendMessage() {
    const input = this.chatInput.trim();
    if (!input) return; // Prevent empty messages

    // Push user message immediately
    this.messages.push({ from: 'user', text: input });

    // Clear input field
    this.chatInput = '';

    // Show typing indicator and set sending flag
    this.isBotTyping = true; // Set typing flag to true when sending the message
    this.isSending = true; // Set sending flag to true while waiting for the response

    // Manually trigger change detection to ensure the view is updated
    this.cdr.detectChanges();

    // Call the chatbot service API
    this.chatbotService.sendMessageToApi(input).subscribe(
      (res) => {
        // Push bot's response to the messages array
        this.messages.push({ from: 'bot', text: res.response });

        // Hide typing indicator and reset sending flag
        this.isBotTyping = false;
        this.isSending = false;

        // Trigger change detection after receiving the response
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      (err) => {
        // Handle errors
        this.messages.push({
          from: 'bot',
          text: 'Sorry, something went wrong.',
        });

        // Reset typing indicator and sending flag
        this.isBotTyping = false;
        this.isSending = false;

        // Trigger change detection after error
        this.cdr.detectChanges(); // Manually trigger change detection
      }
    );
  }

  //from this is the shipment chart==============================================
}

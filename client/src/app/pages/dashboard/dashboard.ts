import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReusableTable } from '../../shared/components/reusable-table/reusable-table';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Header } from '../../shared/components/header/header';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [Sidebar, Header, FormsModule,CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements AfterViewChecked {
  @ViewChild('chatBody') private chatBody!: ElementRef;

  isChatOpen = false;
  chatInput = '';
  messages: { from: 'user' | 'bot'; text: string }[] = [];

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage() {
    const input = this.chatInput.trim();
    if (!input) return; // Prevent empty messages

    // Push user message immediately
    this.messages.push({ from: 'user', text: input });

    // Clear input field
    this.chatInput = '';

    // Simulate bot response after delay (replace with real API call)
    const botReply = this.getBotResponse(input);
    setTimeout(() => {
      this.messages.push({ from: 'bot', text: botReply });
    }, 600);
  }

  getBotResponse(input: string): string {
    const lower = input.toLowerCase();
    if (lower.includes('today') && lower.includes('update') && lower.includes('intransit')) {
      return 'Today’s updates: 4 shipments dispatched, 2 arrived, 1 delayed.';
    }
    return "Sorry, I didn't understand. Try asking about today's in-transit updates.";
  }

  // After each view check, scroll chat to bottom
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    try {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    } catch (err) {
      // Ignore if chatBody is not yet available
    }
  }
}

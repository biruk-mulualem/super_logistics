import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Header } from '../../shared/components/header/header';
import { HttpClientModule } from '@angular/common/http';
import { ChatbotService } from '../../services/chatbot/chatbot.service';
@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [Sidebar, Header, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements AfterViewChecked {
  @ViewChild('chatBody') private chatBody!: ElementRef;

  isChatOpen = false;
  chatInput = '';
  messages: { from: 'user' | 'bot'; text: string }[] = [];
  isSending = false; // To handle when the bot is processing the request
  isBotTyping = false; // To show the typing indicator

  constructor(
    private chatbotService: ChatbotService,
     private cdr: ChangeDetectorRef
  
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

  // ============================================== Backend Interaction =========================================

sendMessage() {
  const input = this.chatInput.trim();
  if (!input) return; // Prevent empty messages

  // Push user message immediately
  this.messages.push({ from: 'user', text: input });

  // Clear input field
  this.chatInput = '';

  // Show typing indicator and set sending flag
  this.isBotTyping = true;  // Set typing flag to true when sending the message
  this.isSending = true;    // Set sending flag to true while waiting for the response

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
      this.cdr.detectChanges();  // Manually trigger change detection
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
      this.cdr.detectChanges();  // Manually trigger change detection
    }
  );
}


}

import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatbotService } from '../../../services/chatbot/chatbot.service';
@Component({
  selector: 'app-chatbot',
  imports: [FormsModule, CommonModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})
export class Chatbot implements AfterViewChecked, OnInit {
  @ViewChild('chatBody') private chatBody!: ElementRef;
  // Chat
  isChatOpen = false;
  chatInput = '';
  messages: { from: 'user' | 'bot'; text: string }[] = [];
  isSending = false;
  isBotTyping = false;
  constructor(
    private chatbotService: ChatbotService,
    private cdr: ChangeDetectorRef
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
      this.chatBody.nativeElement.scrollTop =
        this.chatBody.nativeElement.scrollHeight;
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
        this.messages.push({
          from: 'bot',
          text: 'Sorry, something went wrong.',
        });
        this.isBotTyping = false;
        this.isSending = false;
        this.cdr.detectChanges();
      }
    );
  }
  // -------------------- Initialization --------------------
  ngOnInit(): void {
    this.cdr.detectChanges();
  }
}

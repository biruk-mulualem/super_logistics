import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';  // Needed for *ngIf, *ngFor
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main-modal',
  standalone: true, // ✅ must be standalone to use 'imports'
  imports: [CommonModule, FormsModule], // ✅ CommonModule for *ngIf/*ngFor, FormsModule for ngModel
  templateUrl: './mainmodal.html',
  styleUrls: ['./mainmodal.css']
})
export class MainModal {
  @Input() data: any;
  @Input() activeTab: 'detail' | 'edit' | 'payment' | 'delete' = 'detail';
  
  @Output() setTab = new EventEmitter<'detail' | 'edit' | 'payment' | 'delete'>();
  @Output() saveEdit = new EventEmitter<any>();
  @Output() savePayment = new EventEmitter<any>();
  @Output() delete = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  switchTab(tab: 'detail' | 'edit' | 'payment' | 'delete') {
    this.setTab.emit(tab);
  }

  saveEditedData() {
    this.saveEdit.emit(this.data);
  }

  savePaymentData() {
    this.savePayment.emit(this.data);
  }

  confirmDelete() {
    this.delete.emit();
  }

  closeModal() {
    this.close.emit();
  }
}

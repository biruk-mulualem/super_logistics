import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-modal',
  standalone: true, // ✅ make it standalone
  imports: [CommonModule, FormsModule], // ✅ import required modules
  templateUrl: './addmodal.html',
  styleUrls: ['./addmodal.css']
})
export class AddModal {
  @Input() data: any;
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  addItem() {
    this.data.items.push({ itemDescription: '', quantity: '', unitPrice: '', uom: '' });
  }

  removeItem(index: number) {
    this.data.items.splice(index, 1);
  }

  saveData() {
    this.save.emit(this.data);
  }

  closeModal() {
    this.close.emit();
  }
}

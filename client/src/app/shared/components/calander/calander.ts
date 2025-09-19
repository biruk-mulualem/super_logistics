import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import EthiopianCalendar from 'ethiopian-calendar-new';
@Component({
  selector: 'app-calander',
  imports: [FormsModule, CommonModule],
  templateUrl: './calander.html',
  styleUrl: './calander.css',
})
export class Calander implements OnInit {
  // Calendar
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  days: (Date | null)[] = [];
  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  constructor(private cdr: ChangeDetectorRef) {}
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
    const eth = EthiopianCalendar.toEthiopian(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );
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
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }
  // -------------------- Initialization --------------------
  ngOnInit(): void {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.generateCalendar(this.currentYear, this.currentMonth);
    this.cdr.detectChanges();
  }
}

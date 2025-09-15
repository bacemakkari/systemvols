import { Component, Input, Output, EventEmitter, signal, computed, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="calendar-container">
      <div class="calendar-header">
        <button 
          type="button"
          class="calendar-nav-btn"
          (click)="previousMonth()"
          [disabled]="isPreviousDisabled()"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        
        <h2 class="calendar-title">
          {{ currentMonthName() }} {{ currentYear() }}
        </h2>
        
        <button 
          type="button"
          class="calendar-nav-btn"
          (click)="nextMonth()"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
      
      <div class="calendar-grid">
        <div class="calendar-day-header" *ngFor="let day of weekDays">
          {{ day }}
        </div>
        
        <button
          *ngFor="let day of calendarDays()"
          type="button"
          class="calendar-day"
          [class.today]="day.isToday"
          [class.selected]="day.isSelected"
          [class.other-month]="!day.isCurrentMonth"
          [class.disabled]="day.isDisabled"
          [disabled]="day.isDisabled"
          (click)="selectDate(day.date)"
        >
          {{ day.day }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .calendar-container {
      @apply bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-sm;
    }

    .calendar-header {
      @apply flex items-center justify-between mb-4;
    }

    .calendar-nav-btn {
      @apply p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-800;
    }

    .calendar-nav-btn:disabled {
      @apply opacity-50 cursor-not-allowed hover:bg-transparent;
    }

    .calendar-title {
      @apply text-lg font-semibold text-gray-800;
    }

    .calendar-grid {
      @apply grid grid-cols-7 gap-1;
    }

    .calendar-day-header {
      @apply text-xs font-medium text-gray-500 text-center py-2;
    }

    .calendar-day {
      @apply w-8 h-8 flex items-center justify-center text-sm rounded-full cursor-pointer transition-all duration-200;
    }

    .calendar-day:hover:not(.disabled) {
      @apply bg-blue-100;
    }

    .calendar-day.today {
      @apply bg-blue-100 text-blue-700 font-medium;
    }

    .calendar-day.selected {
      @apply bg-blue-600 text-white font-medium;
    }

    .calendar-day.other-month {
      @apply text-gray-400;
    }

    .calendar-day.disabled {
      @apply text-gray-300 cursor-not-allowed;
    }

    .calendar-day.disabled:hover {
      @apply bg-transparent;
    }
  `]
})
export class CalendarComponent implements OnInit, OnChanges {
  @Input() initialDate: Date = new Date();
  @Output() dateSelected = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();
  
  private currentDate = signal(new Date());
  private selectedDate = signal<Date | null>(null);
  private today = new Date();
  
  weekDays = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
  monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  currentYear = computed(() => this.currentDate().getFullYear());
  currentMonth = computed(() => this.currentDate().getMonth());
  currentMonthName = computed(() => this.monthNames[this.currentMonth()]);

  calendarDays = computed(() => {
    const year = this.currentYear();
    const month = this.currentMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;
    
    const days: CalendarDay[] = [];
    
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthDays - i);
      days.push({
        date,
        day: prevMonthDays - i,
        isCurrentMonth: false,
        isToday: this.isSameDay(date, this.today),
        isSelected: this.selectedDate() ? this.isSameDay(date, this.selectedDate()!) : false,
        isDisabled: date < this.today
      });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        day,
        isCurrentMonth: true,
        isToday: this.isSameDay(date, this.today),
        isSelected: this.selectedDate() ? this.isSameDay(date, this.selectedDate()!) : false,
        isDisabled: date < this.today
      });
    }
    
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isToday: this.isSameDay(date, this.today),
        isSelected: this.selectedDate() ? this.isSameDay(date, this.selectedDate()!) : false,
        isDisabled: date < this.today
      });
    }
    
    return days;
  });

  ngOnInit() {
    // Initialize with the provided initial date
    if (this.initialDate) {
      this.currentDate.set(new Date(this.initialDate));
      if (this.initialDate >= this.today) {
        this.selectedDate.set(new Date(this.initialDate));
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialDate'] && this.initialDate) {
      this.currentDate.set(new Date(this.initialDate));
      if (this.initialDate >= this.today) {
        this.selectedDate.set(new Date(this.initialDate));
      }
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  selectDate(date: Date): void {
    if (date < this.today) return;
    
    this.selectedDate.set(date);
    const formattedDate = this.formatDate(date);
    this.dateSelected.emit(formattedDate);
  }

  previousMonth(): void {
    const current = this.currentDate();
    const newDate = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    this.currentDate.set(newDate);
  }

  nextMonth(): void {
    const current = this.currentDate();
    const newDate = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    this.currentDate.set(newDate);
  }

  isPreviousDisabled(): boolean {
    const current = this.currentDate();
    const firstOfCurrentMonth = new Date(current.getFullYear(), current.getMonth(), 1);
    const firstOfThisMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    return firstOfCurrentMonth <= firstOfThisMonth;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Add cancel method if needed
  cancel(): void {
    this.cancelled.emit();
  }
}
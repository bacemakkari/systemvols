import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ShowSections {
  escales: boolean;
  heuresDepart: boolean;
  dureeVoyage: boolean;
}

interface FilterOptions {
  escales: string[];
  heuresDepart: { min: number; max: number };
  dureeVoyage: { min: number; max: number };
}

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Escales Filter -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <button 
          (click)="toggleSection('escales')"
          class="flex items-center justify-between w-full text-left mb-4">
          <h3 class="text-base font-semibold text-gray-900">Escales</h3>
          <svg 
            class="w-4 h-4 transform transition-transform duration-200"
            [class.rotate-180]="!showSections().escales"
            fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>

        <div *ngIf="showSections().escales" class="space-y-3">
          <label class="flex items-center">
            <input 
              type="checkbox" 
              [checked]="filters().direct"
              (change)="onDirectChange($event)"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2">
            <span class="ml-3 text-sm">
              <div class="font-medium text-gray-900">Direct</div>
              <div class="text-xs text-gray-500">à partir de 79 €</div>
            </span>
          </label>

          <label class="flex items-center">
            <input 
              type="checkbox" 
              [checked]="filters().oneStop"
              (change)="onOneStopChange($event)"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2">
            <span class="ml-3 text-sm">
              <div class="font-medium text-gray-900">1 escale</div>
              <div class="text-xs text-gray-500">à partir de 104 €</div>
            </span>
          </label>

          <label class="flex items-center">
            <input 
              type="checkbox" 
              [checked]="filters().multipleStops"
              (change)="onMultipleStopsChange($event)"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2">
            <span class="ml-3 text-sm">
              <div class="font-medium text-gray-900">2+ escales</div>
              <div class="text-xs text-gray-500">à partir de 373 €</div>
            </span>
          </label>
        </div>
      </div>

      <!-- Departure Time Filter -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <button 
          (click)="toggleSection('heuresDepart')"
          class="flex items-center justify-between w-full text-left mb-4">
          <h3 class="text-base font-semibold text-gray-900">Heures de départ</h3>
          <svg 
            class="w-4 h-4 transform transition-transform duration-200"
            [class.rotate-180]="!showSections().heuresDepart"
            fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>

        <div *ngIf="showSections().heuresDepart">
          <div class="px-2">
            <div class="flex justify-between text-sm text-gray-500 mb-2">
              <span>Aller</span>
            </div>
            <div class="flex justify-between text-sm text-gray-900 mb-4">
              <span>{{ formatTime(departureTime().min) }}</span>
              <span>{{ formatTime(departureTime().max) }}</span>
            </div>
            
            <!-- Custom Range Slider -->
            <div class="relative">
              <input 
                type="range" 
                [min]="0" 
                [max]="1439"
                [value]="departureTime().min"
                (input)="onDepartureMinChange($event)"
                class="absolute w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider">
              <input 
                type="range" 
                [min]="0" 
                [max]="1439"
                [value]="departureTime().max"
                (input)="onDepartureMaxChange($event)"
                class="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider">
            </div>
          </div>
        </div>
      </div>

      <!-- Journey Duration Filter -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <button 
          (click)="toggleSection('dureeVoyage')"
          class="flex items-center justify-between w-full text-left mb-4">
          <h3 class="text-base font-semibold text-gray-900">Durée du voyage</h3>
          <svg 
            class="w-4 h-4 transform transition-transform duration-200"
            [class.rotate-180]="!showSections().dureeVoyage"
            fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>

        <div *ngIf="showSections().dureeVoyage">
          <div class="px-2">
            <div class="flex justify-between text-sm text-gray-900 mb-4">
              <span>{{ formatDuration(journeyDuration().min) }}</span>
              <span>{{ formatDuration(journeyDuration().max) }}</span>
            </div>
            
            <!-- Journey Duration Range Slider -->
            <div class="relative">
              <input 
                type="range" 
                [min]="180" 
                [max]="2640"
                [value]="journeyDuration().min"
                (input)="onJourneyMinChange($event)"
                class="absolute w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider">
              <input 
                type="range" 
                [min]="180" 
                [max]="2640"
                [value]="journeyDuration().max"
                (input)="onJourneyMaxChange($event)"
                class="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider">
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .slider {
      -webkit-appearance: none;
      height: 8px;
      border-radius: 4px;
      outline: none;
    }

    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #0770e3;
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .slider::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #0770e3;
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
  `]
})
export class FilterSidebarComponent {
  @Output() filtersChanged = new EventEmitter<FilterOptions>();

  showSections = signal<ShowSections>({
    escales: true,
    heuresDepart: true,
    dureeVoyage: true
  });

  filters = signal({
    direct: true,
    oneStop: true,
    multipleStops: true
  });

  departureTime = signal({
    min: 0,    // 00:00
    max: 1439  // 23:59
  });

  journeyDuration = signal({
    min: 180,  // 3.0 hours
    max: 2640  // 44.0 hours
  });

  toggleSection(section: keyof ShowSections) {
    const current = this.showSections();
    current[section] = !current[section];
    this.showSections.set({ ...current });
  }

  onDirectChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.filters.update(current => ({ ...current, direct: target.checked }));
    this.emitFilters();
  }

  onOneStopChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.filters.update(current => ({ ...current, oneStop: target.checked }));
    this.emitFilters();
  }

  onMultipleStopsChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.filters.update(current => ({ ...current, multipleStops: target.checked }));
    this.emitFilters();
  }

  onDepartureMinChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.departureTime.update(current => ({ ...current, min: parseInt(target.value) }));
    this.emitFilters();
  }

  onDepartureMaxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.departureTime.update(current => ({ ...current, max: parseInt(target.value) }));
    this.emitFilters();
  }

  onJourneyMinChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.journeyDuration.update(current => ({ ...current, min: parseInt(target.value) }));
    this.emitFilters();
  }

  onJourneyMaxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.journeyDuration.update(current => ({ ...current, max: parseInt(target.value) }));
    this.emitFilters();
  }

  private emitFilters() {
    const escales = [];
    const filters = this.filters();
    
    if (filters.direct) escales.push('direct');
    if (filters.oneStop) escales.push('1');
    if (filters.multipleStops) escales.push('2+');

    this.filtersChanged.emit({
      escales,
      heuresDepart: this.departureTime(),
      dureeVoyage: this.journeyDuration()
    });
  }

  formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  formatDuration(minutes: number): string {
    const hours = minutes / 60;
    return `${hours.toFixed(1)} heures`;
  }
}
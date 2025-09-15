import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight, FlightService, ReservationRequest, Passager } from '../../services/flight.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-flight-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flight-card bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center justify-between mb-4">
            <!-- Departure -->
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900">{{ flight.heure_depart }}</div>
              <div class="text-sm text-gray-600">{{ getAirportCode(flight.ville_depart) }}</div>
              <div class="text-xs text-gray-500">{{ flight.ville_depart }}</div>
            </div>

            <!-- Flight Duration and Route -->
            <div class="flex-1 flex flex-col items-center">
              <div class="text-xs text-gray-500 mb-1">{{ flight.temps_trajet_formatted }}</div>
              <div class="w-full flex items-center justify-center relative">
                <div class="flex-1 h-px bg-gray-300"></div>
                <div class="mx-2">
                  <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                  </svg>
                </div>
                <div class="flex-1 h-px bg-gray-300"></div>
              </div>
              <div class="text-xs text-gray-500 mt-1">Direct</div>
            </div>

            <!-- Arrival -->
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900">{{ flight.heure_arrivee }}</div>
              <div class="text-sm text-gray-600">{{ getAirportCode(flight.ville_arrivee) }}</div>
              <div class="text-xs text-gray-500">{{ flight.ville_arrivee }}</div>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="flex items-center text-sm text-gray-600 space-x-4">
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {{ flight.places_disponibles }} places disponibles
            </span>
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ flight.compagnie }}
            </span>
          </div>
        </div>

        <!-- Price and Book Button -->
        <div class="text-right ml-6">
          <div class="text-2xl font-bold text-gray-900 mb-2">{{ flight.prix }} €</div>
          <button 
            (click)="openReservationModal()"
            class="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded font-medium transition-colors flex items-center">
            Réserver
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Reservation Modal -->
      <div 
        *ngIf="showReservationModal"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        (click)="closeReservationModal()"
      >
        <div 
          (click)="stopPropagation($event)"
          class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Réserver ce vol</h3>
            <button 
              (click)="closeReservationModal()"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Flight Summary -->
          <div class="bg-gray-50 rounded-lg p-4 mb-4">
            <div class="flex justify-between items-center mb-2">
              <span class="font-medium">{{ flight.ville_depart }} → {{ flight.ville_arrivee }}</span>
              <span class="text-lg font-bold text-blue-600">{{ flight.prix }} €</span>
            </div>
            <div class="text-sm text-gray-600">
              {{ flight.heure_depart }} - {{ flight.heure_arrivee }} • {{ flight.temps_trajet_formatted }}
            </div>
            <div class="text-sm text-gray-600">
              Places disponibles: {{ flight.places_disponibles }}
            </div>
          </div>

          <!-- Reservation Form -->
          <form (ngSubmit)="submitReservation()" #reservationForm="ngForm">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input
                  type="text"
                  [(ngModel)]="reservationData.passager.prenom"
                  name="prenom"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Votre prénom"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  [(ngModel)]="reservationData.passager.nom"
                  name="nom"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  [(ngModel)]="reservationData.passager.email"
                  name="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="votre.email@exemple.com"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de places</label>
                <select
                  [(ngModel)]="reservationData.nombrePlaces"
                  name="nombrePlaces"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1">1 place</option>
                  <option value="2">2 places</option>
                  <option value="3">3 places</option>
                  <option value="4">4 places</option>
                  <option value="5">5 places</option>
                </select>
              </div>
            </div>

            <!-- Error Message -->
            <div *ngIf="reservationError" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {{ reservationError }}
            </div>

            <!-- Success Message -->
            <div *ngIf="reservationSuccess" class="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              Réservation confirmée ! Numéro: {{ reservationSuccess.numeroReservation }}
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-3 mt-6">
              <button
                type="button"
                (click)="closeReservationModal()"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                [disabled]="!reservationForm.form.valid || isSubmitting"
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span *ngIf="!isSubmitting">Confirmer la réservation</span>
                <span *ngIf="isSubmitting" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Réservation...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class FlightCardComponent {
  @Input() flight!: Flight;

  showReservationModal = false;
  isSubmitting = false;
  reservationError: string | null = null;
  reservationSuccess: any = null;

  reservationData: ReservationRequest = {
    volId: '',
    passager: {
      nom: '',
      prenom: '',
      email: ''
    },
    nombrePlaces: 1
  };

  constructor(private flightService: FlightService) {}

  openReservationModal() {
    this.reservationData.volId = this.flight.id;
    this.showReservationModal = true;
    this.reservationError = null;
    this.reservationSuccess = null;
  }

  closeReservationModal() {
    this.showReservationModal = false;
    this.reservationError = null;
    this.reservationSuccess = null;
    // Reset form
    this.reservationData = {
      volId: '',
      passager: {
        nom: '',
        prenom: '',
        email: ''
      },
      nombrePlaces: 1
    };
  }

  submitReservation() {
    this.isSubmitting = true;
    this.reservationError = null;

    this.flightService.createReservation(this.reservationData).subscribe({
      next: (response) => {
        this.reservationSuccess = response;
        this.isSubmitting = false;
        // Auto-close modal after 3 seconds
        setTimeout(() => {
          this.closeReservationModal();
        }, 3000);
      },
      error: (error) => {
        this.isSubmitting = false;
        if (error.error && error.error.message) {
          this.reservationError = error.error.message;
        } else {
          this.reservationError = 'Une erreur est survenue lors de la réservation. Veuillez réessayer.';
        }
      }
    });
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  getAirportCode(city: string): string {
    const codes: { [key: string]: string } = {
      'Paris': 'ORY',
      'Lyon': 'LYS',
      'Marseille': 'MRS',
      'Nice': 'NCE',
      'Toulouse': 'TLS',
      'Bordeaux': 'BOD',
      'Nantes': 'NTE',
      'Strasbourg': 'SXB',
      'Lille': 'LIL',
      'Montpellier': 'MPL'
    };
    return codes[city] || city.substring(0, 3).toUpperCase();
  }
}
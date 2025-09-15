import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, map, throwError } from 'rxjs';

export interface Flight {
  id: string;
  ville_depart: string;
  ville_arrivee: string;
  date_depart: string;
  date_arrivee: string;
  prix: number;
  temps_trajet: number; // Backend returns minutes as number
  places_disponibles: number;
  places_reservees: number;
  capacite_maximale: number;
  created_at?: string;
  updated_at?: string;
  // Frontend display properties
  compagnie?: string;
  heure_depart?: string;
  heure_arrivee?: string;
  offres?: string;
  escales?: number;
  bagages?: boolean;
  direct?: boolean;
  temps_trajet_formatted?: string; // For display
}

export interface FlightSearchParams {
  date_depart?: string;
  date_arrivee?: string;
  ville_depart?: string;
  ville_arrivee?: string;
  tri?: 'prix' | 'temps_trajet';
  travellers?: { adults: number; cabinClass: string };
}

export interface FlightSearchResponse {
  flights: Flight[];
  total: number;
}

export interface PriceDateRange {
  date: string;
  price: number;
}

export interface Passager {
  nom: string;
  prenom: string;
  email: string;
}

export interface ReservationRequest {
  volId: string;
  passager: Passager;
  nombrePlaces: number;
}

export interface ReservationResponse {
  numeroReservation: string;
  volId: string;
  passager: Passager;
  nombrePlaces: number;
  dateReservation: string;
}

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private readonly baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  searchFlights(params: FlightSearchParams): Observable<FlightSearchResponse> {
    let httpParams = new HttpParams();
    
    if (params.date_depart) {
      httpParams = httpParams.set('date_depart', params.date_depart);
    }
    if (params.date_arrivee) {
      httpParams = httpParams.set('date_arrivee', params.date_arrivee);
    }
    if (params.ville_depart) {
      httpParams = httpParams.set('ville_depart', params.ville_depart);
    }
    if (params.ville_arrivee) {
      httpParams = httpParams.set('ville_arrivee', params.ville_arrivee);
    }
    if (params.tri) {
      httpParams = httpParams.set('tri', params.tri);
    }

    return this.http.get<Flight[]>(`${this.baseUrl}/vols`, { params: httpParams })
      .pipe(
        map(flights => ({
          flights: this.enrichFlightData(flights),
          total: flights.length
        })),
        catchError(error => {
          console.error('Error fetching flights:', error);
          return throwError(() => error);
        })
      );
  }

  getAvailableSeats(volId: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/vols/${volId}/places`)
      .pipe(
        catchError(error => {
          console.error('Error fetching available seats:', error);
          return throwError(() => error);
        })
      );
  }

  createReservation(request: ReservationRequest): Observable<ReservationResponse> {
    return this.http.post<ReservationResponse>(`${this.baseUrl}/reservations`, request)
      .pipe(
        catchError(error => {
          console.error('Error creating reservation:', error);
          return throwError(() => error);
        })
      );
  }

  private enrichFlightData(flights: Flight[]): Flight[] {
    return flights.map(flight => ({
      ...flight,
      compagnie: this.getRandomAirline(),
      heure_depart: this.extractTimeFromDateTime(flight.date_depart),
      heure_arrivee: this.extractTimeFromDateTime(flight.date_arrivee),
      temps_trajet_formatted: this.formatDuration(flight.temps_trajet),
      offres: Math.floor(Math.random() * 20 + 5).toString(),
      escales: Math.floor(Math.random() * 3),
      bagages: Math.random() > 0.5,
      direct: Math.random() > 0.3
    }));
  }

  private getRandomAirline(): string {
    const airlines = ['Air France', 'Transavia France', 'Nouvelair', 'Ryanair', 'EasyJet'];
    return airlines[Math.floor(Math.random() * airlines.length)];
  }

  private extractTimeFromDateTime(dateTimeStr: string): string {
    try {
      const date = new Date(dateTimeStr);
      return date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } catch {
      return '00:00';
    }
  }

  private formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  }

  getFlightsByDateRange(): Observable<PriceDateRange[]> {
    // This would ideally be a separate endpoint, but for now we'll generate mock data
    const mockPrices: PriceDateRange[] = [
      { date: '2025-01-14', price: 95 },
      { date: '2025-01-15', price: 89 },
      { date: '2025-01-16', price: 102 },
      { date: '2025-01-17', price: 88 },
      { date: '2025-01-18', price: 97 },
    ];
    return of(mockPrices);
  }

  formatFlightTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }

  formatFlightDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  }
}
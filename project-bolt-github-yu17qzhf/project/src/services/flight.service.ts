import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';

export interface Flight {
  id: string;
  ville_depart: string;
  ville_arrivee: string;
  date_depart: string;
  date_arrivee: string;
  prix: number;
  temps_trajet: string;
  places_disponibles?: number;
  compagnie?: string;
  heure_depart?: string;
  heure_arrivee?: string;
  offres?: string;
  escales?: number;
  bagages?: boolean;
  direct?: boolean;
}

export interface FlightSearchParams {
  date_depart?: string;
  date_retour?: string;
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

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) {}

  searchFlights(params: FlightSearchParams): Observable<FlightSearchResponse> {
    let httpParams = new HttpParams();
    
    if (params.date_depart) {
      httpParams = httpParams.set('date_depart', params.date_depart);
    }
    if (params.date_retour) {
      httpParams = httpParams.set('date_arrivee', params.date_retour);
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
          return of(this.getMockFlights(params));
        })
      );
  }

  private enrichFlightData(flights: Flight[]): Flight[] {
    return flights.map(flight => ({
      ...flight,
      compagnie: ['Air France', 'Ryanair', 'EasyJet'][Math.floor(Math.random() * 3)],
      heure_depart: flight.date_depart ? this.formatFlightTime(flight.date_depart) : undefined,
      heure_arrivee: flight.date_arrivee ? this.formatFlightTime(flight.date_arrivee) : undefined,
      offres: 'Multiple',
      escales: Math.floor(Math.random() * 3),
      bagages: Math.random() > 0.5,
      direct: Math.random() > 0.3
    }));
  }

  private getMockFlights(params: FlightSearchParams): FlightSearchResponse {
    const mockFlights: Flight[] = [
      {
        id: '1',
        ville_depart: 'Toulouse',
        ville_arrivee: 'Djerba',
        date_depart: '2025-09-22',
        date_arrivee: '2025-09-30',
        prix: 79,
        temps_trajet: '2:55',
        places_disponibles: 45,
        compagnie: 'Transavia France',
        heure_depart: '12:35',
        heure_arrivee: '15:30',
        offres: '13',
        escales: 0,
        bagages: true,
        direct: true
      },
      {
        id: '2',
        ville_depart: 'Toulouse',
        ville_arrivee: 'Djerba',
        date_depart: '2025-03-07',
        date_arrivee: '2025-03-07',
        prix: 79,
        temps_trajet: '2:55',
        places_disponibles: 23,
        compagnie: 'Transavia France',
        heure_depart: '14:55',
        heure_arrivee: '17:50',
        offres: '13',
        escales: 0,
        bagages: false,
        direct: true
      },
      {
        id: '3',
        ville_depart: 'Paris',
        ville_arrivee: 'Djerba',
        date_depart: '2025-03-07',
        date_arrivee: '2025-03-07',
        prix: 96,
        temps_trajet: '2:50',
        places_disponibles: 67,
        compagnie: 'Nouvelair',
        heure_depart: '13:05',
        heure_arrivee: '15:55',
        offres: '12',
        escales: 0,
        bagages: true,
        direct: true
      }
    ];

    let filtered = mockFlights;
    
    if (params.ville_depart) {
      filtered = filtered.filter(f => 
        f.ville_depart.toLowerCase().includes(params.ville_depart!.toLowerCase())
      );
    }
    
    if (params.ville_arrivee) {
      filtered = filtered.filter(f => 
        f.ville_arrivee.toLowerCase().includes(params.ville_arrivee!.toLowerCase())
      );
    }

    if (params.tri === 'prix') {
      filtered.sort((a, b) => a.prix - b.prix);
    } else if (params.tri === 'temps_trajet') {
      filtered.sort((a, b) => {
        const timeA = this.parseTimeToMinutes(a.temps_trajet || '0:00');
        const timeB = this.parseTimeToMinutes(b.temps_trajet || '0:00');
        return timeA - timeB;
      });
    }

    return {
      flights: filtered,
      total: filtered.length
    };
  }

  getFlightsByDateRange(): Observable<PriceDateRange[]> {
    const mockPrices: PriceDateRange[] = [
      { date: '2025-09-14', price: 95 },
      { date: '2025-09-15', price: 89 },
      { date: '2025-09-16', price: 102 },
      { date: '2025-09-17', price: 88 },
      { date: '2025-09-18', price: 97 },
    ];
    return of(mockPrices);
  }

  private parseTimeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + (minutes || 0);
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
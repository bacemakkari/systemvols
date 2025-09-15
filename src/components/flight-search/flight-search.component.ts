searchFlights() {
    if (!this.isSearchValid()) {
      this.errorMessage.set('Veuillez remplir au minimum les champs départ, arrivée et date de départ.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    console.log('Search params:', this.searchParams());

    this.flightService.searchFlights(this.searchParams()).subscribe({
      next: (response) => {
        console.log('Search response:', response);
        this.searchResults.set(response);
        this.hasSearched.set(true);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Search error details:', error);
        let errorMsg = 'Une erreur est survenue lors de la recherche.';
        if (error.status === 0) {
          errorMsg = 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.';
        } else if (error.error && error.error.message) {
          errorMsg = error.error.message;
        }
        this.errorMessage.set(errorMsg);
        this.isLoading.set(false);
      }
    });
  }

  isSearchValid(): boolean {
    const params = this.searchParams();
    return !!params.ville_depart && !!params.ville_arrivee && !!params.date_depart;
  }

  filteredFlights(): Flight[] {
    const results = this.searchResults()?.flights || [];
    console.log('Filtering flights:', results);
    const filters = this.filters();

    return results.filter(flight => {
      const escalesValue = flight.direct ? 'direct' : (flight.escales ?? 0).toString() + '+';
      const isEscalesMatch = filters.escales.includes(escalesValue);
      const departureMinutes = flight.heure_depart ? this.parseTimeToMinutes(flight.heure_depart) : 0;
      const isTimeMatch = departureMinutes >= filters.heuresDepart.min && departureMinutes <= filters.heuresDepart.max;
      const durationMinutes = typeof flight.temps_trajet === 'number' ? flight.temps_trajet : 0;
      const isDurationMatch = durationMinutes >= filters.dureeVoyage.min && durationMinutes <= filters.dureeVoyage.max;

      return isEscalesMatch && isTimeMatch && isDurationMatch;
    });
  }

            <!-- No Results -->
            <div *ngIf="filteredFlights().length === 0 && !isLoading() && hasSearched()" class="text-center py-12">
              <div class="mb-4">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun vol trouvé</h3>
              <p class="text-gray-600">Essayez de modifier vos critères de recherche.</p>
            </div>
            
            <!-- Loading State -->
            <div *ngIf="isLoading()" class="text-center py-12">
              <div class="mb-4">
                <svg class="animate-spin mx-auto h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Recherche en cours...</h3>
              <p class="text-gray-600">Veuillez patienter pendant que nous recherchons les vols.</p>
            </div>
            
            <!-- Error State -->
            <div *ngIf="errorMessage() && hasSearched()" class="text-center py-12">
              <div class="mb-4">
                <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Erreur de recherche</h3>
              <p class="text-gray-600 mb-4">{{ errorMessage() }}</p>
              <button 
                (click)="searchFlights()"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
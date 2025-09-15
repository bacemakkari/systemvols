@@ .. @@
   filteredFlights(): Flight[] {
     const results = this.searchResults()?.flights || [];
     const filters = this.filters();

     return results.filter(flight => {
       const escalesValue = flight.direct ? 'direct' : (flight.escales ?? 0).toString() + '+';
       const isEscalesMatch = filters.escales.includes(escalesValue);
-      const departureMinutes = flight.heure_depart ? this.parseTimeToMinutes(flight.heure_depart) : 0;
+      const departureMinutes = flight.heure_depart ? this.parseTimeToMinutes(flight.heure_depart) : 0;
       const isTimeMatch = departureMinutes >= filters.heuresDepart.min && departureMinutes <= filters.heuresDepart.max;
-      const durationMinutes = flight.temps_trajet ? this.parseTimeToMinutes(flight.temps_trajet) : 0;
+      const durationMinutes = typeof flight.temps_trajet === 'number' ? flight.temps_trajet : 0;
       const isDurationMatch = durationMinutes >= filters.dureeVoyage.min && durationMinutes <= filters.dureeVoyage.max;

       return isEscalesMatch && isTimeMatch && isDurationMatch;
     });
   }

   private parseTimeToMinutes(timeStr: string): number {
     const [hours, minutes] = timeStr.split(':').map(Number);
     return hours * 60 + (minutes || 0);
   }
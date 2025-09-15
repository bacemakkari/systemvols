@@ .. @@
   searchFlights() {
     if (!this.isSearchValid()) {
-      this.errorMessage.set('Veuillez remplir tous les champs (départ, arrivée, date de départ et date de retour).');
+      this.errorMessage.set('Veuillez remplir au minimum les champs départ, arrivée et date de départ.');
       return;
     }

      const prevDuration = typeof prev.temps_trajet === 'number' ? prev.temps_trajet : 0;
      const currentDuration = typeof current.temps_trajet === 'number' ? current.temps_trajet : 0;
     const params = this.searchParams();
-    return !!params.ville_depart && !!params.ville_arrivee && !!params.date_depart && !!params.date_retour;
    return shortest.temps_trajet_formatted || '0:00';
   }
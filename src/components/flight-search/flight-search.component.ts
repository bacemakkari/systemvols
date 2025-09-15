@@ .. @@
   searchFlights() {
     if (!this.isSearchValid()) {
-      this.errorMessage.set('Veuillez remplir tous les champs (départ, arrivée, date de départ et date de retour).');
+      this.errorMessage.set('Veuillez remplir au minimum les champs départ, arrivée et date de départ.');
       return;
     }
   }

@@ .. @@
   isSearchValid(): boolean {
     const params = this.searchParams();
-    return !!params.ville_depart && !!params.ville_arrivee && !!params.date_depart && !!params.date_retour;
+    return !!params.ville_depart && !!params.ville_arrivee && !!params.date_depart;
   }
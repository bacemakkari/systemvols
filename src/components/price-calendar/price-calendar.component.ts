@@ .. @@
   loadPriceDates() {
     this.flightService.getFlightsByDateRange().subscribe(data => {
       const priceDates = data.map(item => ({
         date: item.date,
         price: item.price,
         day: this.formatDay(item.date),
         isSelected: item.date === this.selectedDate
       }));
       
       this.priceDates.set(priceDates);
     });
   }

   selectDate(priceDate: PriceDate) {
     // Update selection state
     const updated = this.priceDates().map(pd => ({
       ...pd,
       isSelected: pd.date === priceDate.date
     }));
     
     this.priceDates.set(updated);
     this.dateSelected.emit(priceDate.date);
   }

   getPriceDateClasses(priceDate: PriceDate): string {
     let classes = 'cursor-pointer';
     
     if (priceDate.isSelected) {
       classes += ' selected bg-blue-900 text-white border-blue-900';
     } else {
       classes += ' text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200';
     }

     return classes;
   }

   private formatDay(dateStr: string): string {
     const date = new Date(dateStr);
     const day = date.getDate();
-    const monthNames = ['mars', 'mars', 'mars', 'mars', 'mars', 'mars',
-                       'mars', 'mars', 'mars', 'mars', 'mars', 'mars'];
+    const monthNames = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun',
+                       'jul', 'aoû', 'sep', 'oct', 'nov', 'déc'];
     const month = monthNames[date.getMonth()];
     
     return `${day} ${month}`;
   }
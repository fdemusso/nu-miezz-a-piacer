Aggiungi il banner home per la corsa in pausa, mantenendo la logica attuale del session banner semplice e coerente.

Obiettivo:
- quando esiste una activeRide con stato PAUSED, la home deve mostrare un banner dedicato
- il banner deve avere priorità su ride attiva normale e booking attiva
- l’utente deve poter riprendere facilmente la corsa dalla home

Comportamento richiesto:
1. Leggi activeRide, activeBooking e selectedVehicle dallo store già esistente.
2. Se activeRide.status === PAUSED:
   - mostra banner dedicato “Corsa in pausa”
   - mostra eventualmente da quanto è in pausa, se il dato esiste già
   - CTA principale: “Riprendi corsa”
   - navigazione verso la schermata ride/pause già esistente
3. Se activeRide.status === ACTIVE:
   - mantieni il banner attuale “Corsa in corso”
4. Se non c’è ride ma c’è booking attiva:
   - mantieni il banner booking
5. Se non c’è nulla:
   - nessun banner

Vincoli:
- tocca il minor numero di file possibile
- non creare nuovi store
- non aggiungere nuove slice
- non duplicare logica
- riusa il componente ActiveSessionBanner già presente
- non rompere cancel booking, unlock ed end ride

Output atteso:
- file modificato/i
- breve spiegazione
- come testare il caso paused dalla home
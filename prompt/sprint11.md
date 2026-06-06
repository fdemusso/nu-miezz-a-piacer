Collega fisicamente la voce "Ride" della bottom navbar alla schermata di gestione corsa già esistente.

Obiettivo:
- quando l’utente clicca "Ride" nella navbar inferiore, deve aprirsi la schermata corretta della corsa
- la schermata è la stessa già usata dai banner della home
- non voglio nuova logica di business, solo wiring di navigazione pulito

Comportamento richiesto:
1. Individua il componente della bottom navbar.
2. Individua la route/pagina già usata per gestire la ride attuale.
3. Collega il tab/button "Ride" della navbar a quella route.
4. Mantieni evidenza visiva del tab attivo quando l’utente è in quella schermata.
5. Non duplicare logica di stato nella navbar.
6. Non rompere i collegamenti già esistenti dai banner home.

Vincoli:
- tocca il minor numero di file possibile
- nessuna nuova slice
- nessun refactor ampio
- nessun cambio architetturale
- riusa la route esistente
- se la route non esiste in modo centralizzato, crea il collegamento più semplice e coerente con la navigazione attuale

Output atteso:
- file modificati
- breve spiegazione
- come testare il click sulla navbar "Ride"
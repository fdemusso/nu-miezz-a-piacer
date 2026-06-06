Aggiungi la possibilità di annullare una prenotazione attiva dalla home o dalla sezione booking, mantenendo il progetto semplice e coerente con la VSA.

Contesto:
- Il cliente può avere una booking attiva prima di avviare la corsa.
- La CTA deve comparire solo se la booking è ancora realmente attiva.
- Se la booking non è ancora convertita in ride, deve poter essere cancellata.
- Dopo la cancellazione, il veicolo deve tornare disponibile e la sessione locale deve essere pulita.

Vincoli:
- tocca il minor numero di file possibile
- non introdurre una nuova architettura
- non aggiungere logiche non necessarie
- se esiste già un endpoint o handler adatto, riusalo
- se serve, crea una mini mutation/endpoint coerente con lo stile attuale
- non toccare EndRide
- non introdurre PauseRide in questo step

Comportamento richiesto:
1. Mostra CTA “Annulla prenotazione” solo quando esiste una booking con stato `ACTIVE`.
2. Non mostrare la CTA se la booking è `CONVERTED_TO_RIDE`, `CANCELLED` o `EXPIRED`.
3. Chiedi conferma prima dell’azione.
4. Esegui cancellazione della booking.
5. Aggiorna la booking a `CANCELLED`.
6. Riporta il veicolo a `AVAILABLE`.
7. Pulisci lo stato locale della sessione.
8. Aggiorna la UI con un feedback chiaro di successo.

Output atteso:
- file modificati principali
- breve spiegazione
- come testare annullamento prenotazione
- eventuali limiti noti
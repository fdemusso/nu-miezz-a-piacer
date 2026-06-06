Implementa la slice MVP PauseRide end-to-end, in modo minimale e coerente con la VSA già presente.

Obiettivo:
- aggiungere la possibilità di mettere in pausa una corsa attiva
- aggiungere la possibilità di riprendere la corsa dopo la pausa
- integrare il flow nella UI già esistente, senza rompere booking, unlock o end ride

Vincoli:
- non creare una nuova architettura
- tocca il minor numero di file possibile
- nessuna slice può importarne un’altra
- usa solo i contratti di packages/contracts
- mantieni naming e stile del progetto
- non toccare pause/ride oltre il necessario
- niente geofencing reale
- niente billing reale
- niente notifiche reali
- niente refactor ampi

Riferimento dominio:
- UT.16 PauseRide usa IRideRepository e IVehicleRepository
- la ride deve passare da ACTIVE a PAUSED e viceversa
- il veicolo deve riflettere lo stato di pausa in modo coerente

Comportamento richiesto:
1. Se esiste una ride attiva, mostra un bottone “Metti in pausa”.
2. Alla pausa:
   - aggiorna la ride a PAUSED
   - aggiorna il vehicle in modo coerente
   - salva i cambiamenti
3. Dopo la pausa mostra un bottone “Riprendi corsa”.
4. Alla ripresa:
   - aggiorna la ride a ACTIVE
   - aggiorna il vehicle in modo coerente
   - salva i cambiamenti
5. Mostra feedback chiaro in UI su stato attivo/pausa.
6. Mantieni EndRide separato e funzionante.

Output atteso:
- file modificati principali
- breve spiegazione delle scelte
- come testare pause e ripresa
- eventuali limiti MVP
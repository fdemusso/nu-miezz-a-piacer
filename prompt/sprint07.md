Implementa il recupero rapido di prenotazione attiva e corsa attiva dalla home, senza aggiungere nuove slice backend se non strettamente necessario.

Obiettivo UX:
- Se l’utente ha una booking attiva, la home deve mostrarla chiaramente con CTA “Riprendi prenotazione”.
- Se l’utente ha una ride attiva, la home deve mostrarla chiaramente con CTA “Riprendi corsa”.
- Le CTA devono portare alla schermata corretta già esistente:
  - booking attiva -> flow unlock
  - ride attiva -> /rides/end
- Se non c’è nessuna sessione attiva, la home resta normale.

Vincoli:
- non rompere le slice già fatte
- non creare overengineering
- usa lo stato già presente in Zustand se basta
- mantieni VSA e naming attuali
- tocca il minor numero di file possibile

Cose da fare:
1. Individua dove oggi viene salvato lo stato di booking/ride corrente.
2. Esponi nella home una sezione/banner/card “Sessione attiva”.
3. Mostra un riepilogo minimo: tipo sessione, veicolo, orario.
4. Aggiungi CTA di ritorno:
   - booking -> vai allo sblocco
   - ride -> vai a termina corsa
5. Verifica che dopo refresh della sessione l’utente non perda il punto del flow, almeno lato UI se già possibile.

Output atteso:
- file modificati principali
- breve spiegazione
- come testare il comportamento dalla home
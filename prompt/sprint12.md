Refactor della navigazione ride per eliminare la collisione tra /rides/active e /rides/end.

Problema attuale:
- /rides/end e /rides/active hanno funzionalità sovrapposte
- /rides/active oggi non rileva correttamente la corsa corrente
- voglio che la gestione della corsa viva in un solo posto

Obiettivo:
- usare /rides/active come schermata unica di gestione corsa
- in quella schermata l’utente deve poter:
  - vedere la corsa corrente
  - mettere in pausa se ACTIVE
  - riprendere se PAUSED
  - terminare la corsa
- /rides/end non deve più essere la destinazione principale della UI

Comportamento richiesto:
1. Correggi /rides/active in modo che legga correttamente la corsa corrente dalla stessa fonte di verità già usata dal resto dell’app (store/sessione/route wiring esistente).
2. Se ride.status === ACTIVE:
   - mostra azioni "Metti in pausa" e "Termina corsa"
3. Se ride.status === PAUSED:
   - mostra azioni "Riprendi corsa" e "Termina corsa"
4. Se non esiste una ride corrente:
   - mostra empty state pulito, senza errori
5. Aggiorna navbar e banner per puntare a /rides/active
6. Lascia /rides/end non usata dalla UI principale, oppure trasformala in componente/action interna se conviene, senza fare refactor enormi

Vincoli:
- tocca il minor numero di file possibile
- nessuna nuova slice
- nessun refactor architetturale ampio
- non rompere pause, resume, booking, unlock
- riusa più logica possibile
- evita duplicazione tra /rides/end e /rides/active

Output atteso:
- file modificati
- breve spiegazione
- come testare ACTIVE / PAUSED / no ride
- eventuali limiti noti
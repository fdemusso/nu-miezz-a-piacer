Piccolo fix architetturale prima del prossimo step.

Nel flusso UnlockVehicle, dopo sblocco riuscito e creazione della Ride, la Booking NON deve restare ACTIVE.

Da allineare al dominio condiviso:
- dopo conversione in corsa, la booking deve passare a `BookingStatus.CONVERTED_TO_RIDE` oppure al nome equivalente effettivamente presente nei contracts
- mantieni Vehicle in stato `INUSE`
- mantieni Ride creata correttamente

Obiettivo:
- correggere solo il minimo indispensabile
- toccare il minor numero di file possibile
- nessun refactor
- nessuna modifica fuori scope

Quando hai finito:
1. dimmi quali file hai toccato;
2. conferma il nuovo stato booking usato;
3. dimmi come ritestare rapidamente il flow unlock.
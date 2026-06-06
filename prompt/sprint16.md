Devi eseguire un hardening completo dell’MVP vehicle sharing già implementato, senza introdurre nuove feature di prodotto.

Contesto verificato:
- monorepo Turborepo
- frontend: apps/web
- backend: apps/api
- shared kernel / contratti: packages/contracts
- stack frontend: Next.js 14 App Router, React, Tailwind, shadcn/ui, TanStack Query
- stack backend: Node.js, Express, TypeScript
- database: SQLite + Drizzle ORM
- VSA già in uso e verificata: nessuna slice deve importarne un’altra
- Graphify ha già confermato architettura pulita e assenza di import cycles
- slice già presenti e funzionanti: NearbyVehicles, VehicleDetails, BookVehicle, UnlockVehicle, EndRide, History, Search
- bottom nav già include /history e /search
- obiettivo: consolidare, testare, correggere, non estendere il dominio

Obiettivo hardening:
Rendere il progetto più robusto, verificabile e pronto per demo/CI, senza cambiare il comportamento funzionale già stabilito.

Vincoli non negoziabili:
1. Nessuna nuova feature di business.
2. Nessuna slice nuova.
3. Nessun import tra slice.
4. Nessun refactor che rompa i contratti pubblici già usati da web/api.
5. Tutte le modifiche devono rispettare la struttura VSA esistente.
6. Se trovi ambiguità, fai una scelta minima e coerente, non improvvisare redesign.

Priorità hardening:

1. TypeScript / build hygiene
- Risolvi l’errore preesistente in `@mvp/config` relativo a `process` non trovato.
- Verifica che tutti i package compile-ino senza errori TS.
- Elimina tipi impliciti fragili, `any` inutili e warning evitabili.
- Normalizza eventuali export/import incoerenti nei package condivisi.

2. Contract hardening
- Controlla `packages/contracts` per:
  - duplicazioni di tipi
  - naming incoerente tra repository/services/types
  - interfacce che espongono troppo o troppo poco
- Mantieni solo i contratti necessari all’MVP.
- Se un contratto è usato sia da web che da api, assicurati che sia esplicito e stabile.
- Non cambiare i shape pubblici a meno che non serva per correggere un bug o una fragilità evidente.

3. Repository hardening
- Verifica gli adapter SQLite/Drizzle esistenti.
- Correggi eventuali inconsistenze tra dati salvati e dati restituiti.
- Controlla ordinamenti, mapping, conversioni date/money/status.
- Se trovi logica di filtro in memoria che può restare semplice, lasciala; se trovi bug o ambiguità di mapping, sistemala senza introdurre complessità SQL inutile.

4. Slice hardening
Per ogni slice esistente:
- verifica che il handler sia puro e testabile
- verifica che il router faccia solo parsing e response mapping
- verifica che i tipi input/output siano minimali e coerenti
- verifica che gli errori siano gestiti in modo consistente
- verifica che i mock rimasti siano dichiarati chiaramente come tali

Slice da controllare:
- NearbyVehicles
- VehicleDetails
- BookVehicle
- UnlockVehicle
- EndRide
- History
- Search

5. UI hardening
- Verifica mobile-first e accessibilità su tutte le pagine esistenti.
- Controlla loading, empty, error state.
- Verifica che i link della bottom nav puntino alle route corrette.
- Assicurati che la navigazione attiva sia coerente.
- Elimina eventuali elementi non utilizzati, duplicati o incoerenti con il layout.

6. Theme / UX hardening
- Verifica che il toggle light/dark funzioni in tutte le pagine.
- Controlla contrasto su bottoni, badge, card, testi mutati e faint.
- Correggi eventuali problemi di overflow, layout shift o componenti che rompono su mobile.
- Non cambiare il design system: solo stabilizzazione.

7. Test hardening
- Aggiungi o completa test minimi e mirati dove il rischio è alto:
  - handler puri
  - repository mapping
  - logic di stato veicolo / ride / booking
  - eventuali utility di formatting
- Preferisci test piccoli e chiari ai test e2e complessi.
- Se la codebase non ha già una strategia test, introduci solo ciò che serve per bloccare regressioni critiche.

8. Verifica finale architetturale
- Usa Graphify prima e dopo il lavoro.
- Conferma:
  - zero cross-slice imports
  - dipendenze solo verso `@mvp/contracts`, framework libs e file della stessa slice
  - nessun ciclo introdotto
- Riporta eventuali anomalie residue con priorità.

Workflow richiesto:
1. Analizza la codebase e identifica i punti fragili reali.
2. Applica fix minimi e coerenti.
3. Esegui check finali.
4. Riporta chiaramente cosa è stato corretto e cosa resta come rischio accettato.

Output finale richiesto:
1. elenco file modificati
2. bug/fragilità corretti
3. test aggiunti o aggiornati
4. verifica architetturale finale
5. eventuali rischi residui e perché sono accettabili per l’MVP

Importante:
- non introdurre refactor cosmetici
- non cambiare naming pubblico senza motivo
- non aggiungere nuove dipendenze pesanti
- non trasformare il hardening in una nuova fase di prodotto
- se una modifica è discutibile, privilegia la soluzione più piccola e reversibile
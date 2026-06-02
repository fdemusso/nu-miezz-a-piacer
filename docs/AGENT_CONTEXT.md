# Contesto del Progetto per Agenti IA

Benvenuto! Questo documento sintetizza l'architettura, le convenzioni e le regole principali del progetto per permettere a te (e ad altri agenti IA) di orientarti rapidamente nel codice senza dover dedurre le regole da zero.

## 1. Architettura del Progetto

Il progetto utilizza un monorepo **Turborepo** diviso in 3 aree principali:

```text
vsa/
├─ apps/
│  ├─ api/                 # Backend Node/TypeScript (lato server di ogni slice)
│  └─ web/                 # Frontend React (lato client di ogni slice)
└─ packages/
   └─ contracts/           # SHARED KERNEL: modelli di dominio e interfacce (nessuna dipendenza)
```

La filosofia architetturale è la **Vertical Slice Architecture (VSA)**.
L'applicazione è suddivisa in "fette verticali" (slice), ognuna delle quali modella un singolo caso d'uso (ad es. `BookVehicle`, `EndRide`, `NearbyVehicles`).

## 2. Le Regole d'Oro della VSA

Quando scrivi, modifichi o analizzi il codice, **DEVI rispettare queste invarianti**:

1. **Nessuna dipendenza cross-slice**: Una slice non importa **MAI** da un'altra slice. Se due slice devono condividere dati o chiamarsi, comunicano tramite il database (repository) o tramite interfacce esposte nei contratti.
2. **Dipendenze solo dai Contratti**: Sia `apps/web` che `apps/api` importano modelli e interfacce **solo** da `packages/contracts`.
3. **Dependency Injection**: Gli handler dell'API ricevono le loro dipendenze (come i repository concreti) dall'esterno (solitamente passate dal costruttore/factory). **Non istanziare mai adapter concreti dentro un handler.**
4. **Adapter segregati**: Le implementazioni concrete (es. `SqliteBookingRepository`) vivono in `apps/api/src/adapters/` e sono collegate agli handler solo nel Composition Root (`apps/api/src/composition/container.ts`).

## 3. Struttura di una singola Slice

### Lato Backend (apps/api)
Una slice si compone strettamente di 3 file:
- `<NomeSlice>.types.ts`: Tipi locali di input/output (request/response). Importa solo dai contracts.
- `<NomeSlice>.handler.ts`: Contiene la business logic. Riceve le interfacce da `packages/contracts` via DI.
- `<NomeSlice>.router.ts`: Strato HTTP. Effettua il parsing, chiama l'handler passandogli le dipendenze fornite dal `container`, e restituisce la response HTTP.

### Lato Frontend (apps/web)
Stessa separazione logica:
- `<NomeSlice>.page.tsx`: Componente UI principale (se la slice lo richiede).
- `<NomeSlice>.hook.ts`: Custom hook per fetch e gestione stato locale del caso d'uso.
- `<NomeSlice>.types.ts`: Tipi locali (es. ViewState).

*(Molti hook attualmente sono scaffold che restituiscono dati mockati o statici di loading/error).*

## 4. Dominio (Domain Model)

Tutti i modelli vivono in `packages/contracts/src/index.ts`. Le gerarchie principali sono:
- **User** (Astratta) -> estesa da `Customer`, `Operator`, `PublicAdministrationUser`.
- **Vehicle** (Astratta) -> estesa da `Bicycle`, `Scooter`, `Car`.
- Entità "Data-Centric": `Ride` (corsa attiva), `Booking` (prenotazione), `FleetZone`, `ZoneRule`, `SupportTicket`.

La business logic state-driven vive negli handler (es. `BookVehicle` crea una `Booking` e mette in stato `reserved` il veicolo; `EndRide` aggiorna e addebita il costo).

## 5. Stato Attuale (Sprint 2)

Attualmente stiamo affrontando le funzionalità dello **Sprint 2: Ciclo di vita della corsa**. 
Il flusso tipico è: `BookVehicle` -> `UnlockVehicle` -> `PauseRide` -> `EndRide` (che funge da orchestratore chiamando validator, fatturazione, incentivi e blocco veicolo). L'infrastruttura utilizza implementazioni `Sqlite` in-memory.

---
**NOTA PER GLI AGENTI**: Se devi implementare o modificare una feature, *isola sempre le modifiche alla slice pertinente* e assicurati che non vengano introdotte dipendenze verso adapter concreti. Guarda `EndRide` come riferimento per un handler orchestratore complesso.

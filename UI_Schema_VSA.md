# VSA Vehicle Sharing — Documento Schematico UI

> Documento di riferimento per le interfacce utente delle tre tipologie di profilo: **Cliente**, **Operatore** e **Amministrazione Pubblica**.
> Ogni schermata è descritta con elementi UI, comportamenti e slice VSA collegata.

---

## PROFILO: CLIENTE (Customer)

---

### 1. AUTH — Login / Sign In

**Schermata:** `LoginScreen`
**Slice:** `IAuthService`

| Elemento | Tipo | Comportamento |
|---|---|---|
| Logo / Brand | Immagine centrata | Statico |
| Campo Email | Input text | Validazione formato email |
| Campo Password | Input password | Toggle mostra/nascondi |
| Tasto "Accedi" | Button primary | Chiama `IAuthService.authenticate()` → redirect Home |
| Link "Hai dimenticato la password?" | Text link | → schermata reset (futura) |
| Link "Non hai un account? Registrati" | Text link | → Sign Up Onboarding |
| Messaggi di errore | Inline error | Sotto al campo incriminato |

---

### 2. AUTH — Sign Up (Onboarding 3 slide)

**Schermata:** `OnboardingScreen`
**Slice:** `IAuthService`, `IUserRepository`

#### Slide 1 — Dati Personali
| Elemento | Tipo | Note |
|---|---|---|
| Indicatore step (1/3) | Pill / stepper | Evidenzia slide corrente |
| Nome | Input text | Required |
| Cognome | Input text | Required |
| Data di nascita | Date picker | Validazione età minima |
| Tipo di documento | Select | Patente / CI / Passaporto |
| Numero documento | Input text | Validazione formato |
| Tasto "Avanti" | Button primary | Valida e passa a Slide 2 |

#### Slide 2 — Dati di Contatto
| Elemento | Tipo | Note |
|---|---|---|
| Indicatore step (2/3) | Pill / stepper | |
| Numero di telefono | Input tel | Prefisso internazionale |
| Email | Input email | Validazione formato |
| Conferma email | Input email | Match check |
| Password | Input password | Requisiti forza password |
| Conferma password | Input password | Match check |
| Tasto "Indietro" | Button ghost | Torna a Slide 1 |
| Tasto "Avanti" | Button primary | Valida e passa a Slide 3 |

#### Slide 3 — Termini e Condizioni
| Elemento | Tipo | Note |
|---|---|---|
| Indicatore step (3/3) | Pill / stepper | |
| Testo T&C | Scrollable text area | Obbligatorio scorrerlo |
| Checkbox "Accetto i T&C" | Checkbox | Required per procedere |
| Checkbox "Accetto la Privacy Policy" | Checkbox | Required |
| Checkbox "Comunicazioni marketing" | Checkbox | Opzionale |
| Tasto "Indietro" | Button ghost | Torna a Slide 2 |
| Tasto "Completa Registrazione" | Button primary | Disabled finché T&C non accettati → `IAuthService` crea account → redirect Home |

---

### 3. HOME — Mappa

**Schermata:** `HomeScreen`
**Slice:** `NearbyVehicles` (UT.01), `IGpsTrackingService`

| Elemento | Posizione | Tipo | Comportamento |
|---|---|---|---|
| Mappa full-screen | Sfondo | Map view (Mapbox/Leaflet) | Mostra veicoli disponibili come pin colorati per tipo (bici/scooter/auto) |
| Search bar "Dove vuoi andare?" | In alto, centrata | Input con icona lente | Tap → apre pannello `SearchDestination` dal basso |
| Menu laterale (hamburger ≡) | In alto a sinistra | Icon button | Apre sidebar con voci profilo |
| Tasto centra mappa | In basso a destra | FAB con icona GPS | Centra la mappa sulla posizione corrente |
| Pin veicoli | Su mappa | Marker interattivi | Tap → apre bottom sheet `VehicleDetails` (UT.06) |
| Badge batteria su pin | Overlay pin | Mini indicator | Mostra % batteria (UT.12) per scooter e auto |

**Sidebar (menu laterale):**
| Voce | Slice |
|---|---|
| Profilo & Impostazioni | — |
| Portafoglio / Metodi di pagamento | `ManagePaymentMethod` (UT.15) |
| Listino tariffe | `VehicleDetails` (UT.06) |
| Promozioni attive | `ApplyPromotion` (UT.09) |
| Storico corse | `RideSummary` (UT.05) |
| Supporto | `OpenSupportTicket` (UT.10) |
| Logout | `IAuthService` |

---

### 4. RICERCA DESTINAZIONE — "Dove vuoi andare?"

**Schermata:** `SearchDestinationSheet` (bottom sheet animato)
**Slice:** `SuggestBestVehicle` (UT.08), `EstimateRideCost` (UT.03), `EstimateWalkTime` (UT.07)

| Elemento | Tipo | Comportamento |
|---|---|---|
| Handle drag | Barra in cima al sheet | Swipe down → chiude |
| Campo di ricerca | Input autofocus | Digitazione → risultati in lista |
| Lista suggerimenti | Scrollable list | Luoghi recenti + risultati geocoding |
| Filtro tipo mezzo | Chip selector orizzontale | Bici / Scooter / Auto — filtra veicoli suggeriti |
| Card veicolo suggerito | Card | Tipo, distanza a piedi (UT.07), costo stimato (UT.03), batteria |
| Tasto "Seleziona veicolo" | Button primary | Avvia flusso prenotazione (UT.02) |
| Link "Vedi altri veicoli" | Text link | Espande lista completa |

---

### 5. PERCORSO E PRENOTAZIONE

**Schermata:** `RoutePreviewScreen`
**Slice:** `BookVehicle` (UT.02), `UnlockMethod` (UT.14), `UnlockVehicle` (UT.13), `EstimateRideCost` (UT.03), `ApplyPromotion` (UT.09)

| Elemento | Tipo | Comportamento |
|---|---|---|
| Mappa con doppio percorso | Map view | **Path 1** (tratteggiato): utente → veicolo (a piedi). **Path 2** (continuo): veicolo → destinazione |
| Card info percorso | Bottom sheet fisso | Tempo a piedi, tempo stimato corsa, costo stimato |
| Badge promozione applicata | Chip verde | Se promo attiva → mostra sconto (UT.09) |
| Tasto "Prenota" | Button primary large | `BookVehicle` (UT.02) → veicolo passa a RESERVED |
| Tasto "Sblocca e Parti" | Button primary large | Appare dopo prenotazione → `UnlockMethod` (UT.14) → `UnlockVehicle` (UT.13) |
| Tasto "Paga" | Button accent (verde) | Appare a fine corsa → `EndRide` (UT.04) + `IBillingService` |
| Tasto "Pausa" | Button secondary | Durante corsa → `PauseRide` (UT.16) |
| Indicatore stato corsa | Status bar in alto | RESERVED / IN_USE / PAUSED |

---

### 6. FINE CORSA — Riepilogo e Pagamento

**Schermata:** `RideSummaryScreen`
**Slice:** `EndRide` (UT.04), `RideSummary` (UT.05)

| Elemento | Tipo | Comportamento |
|---|---|---|
| Mappa statica percorso | Map view non interattiva | Tragitto effettuato |
| Durata corsa | Text large | Tempo totale (escluse pause) |
| Costo finale | Text accent large | Importo addebitato |
| Dettaglio costo | Accordion | Sblocco + minuti + pausa + sconto promo |
| Validazione parcheggio | Banner | Verde = OK / Rosso = fuori zona (penale) |
| Bonus parcheggio | Banner verde | Se `ParkingBonusRule` soddisfatta (OP.08) |
| Metodo di pagamento usato | Card small | Tipo + label mascherata |
| Tasto "Segnala problema" | Button ghost | → `OpenSupportTicket` (UT.10) |
| Tasto "Chiudi" | Button primary | Torna a Home |

---

### 7. USER SETTINGS

**Schermata:** `UserSettingsScreen`
**Slice:** `ManagePaymentMethod` (UT.15), `ApplyPromotion` (UT.09), `RideSummary` (UT.05)

#### 7a — Portafoglio / Metodi di Pagamento
| Elemento | Tipo | Comportamento |
|---|---|---|
| Lista metodi salvati | List con icone | Tipo, label mascherata, badge "Default" |
| Tasto "Aggiungi metodo" | Button secondary | Apre form aggiunta |
| Swipe su metodo | Swipe action | Elimina / Imposta default |

#### 7b — Impostazioni Generali
| Elemento | Tipo | Comportamento |
|---|---|---|
| Notifiche push | Toggle | Attiva/disattiva |
| Tipo veicolo preferito | Multi-select chip | Bici / Scooter / Auto |
| Lingua | Select | Italiano / English |
| Cambia password | Row → sheet | Form cambio password |
| Elimina account | Row danger | Conferma modale |

#### 7c — Listino Tariffe
| Elemento | Tipo | Comportamento |
|---|---|---|
| Tab selector | Tab bar | Bici / Scooter / Auto |
| Card tariffa per tipo | Card | Sblocco + €/min + pausa €/min |
| Info zona | Accordion | Tariffe per FleetZone se differenziate |

#### 7d — Promozioni Attive
| Elemento | Tipo | Comportamento |
|---|---|---|
| Lista promozioni | Card list | Codice, descrizione, scadenza, tipo sconto |
| Campo "Inserisci codice promo" | Input + Button | `ApplyPromotion` (UT.09) |
| Badge promo scaduta | Chip rosso | Visibile ma non applicabile |

---

## PROFILO: OPERATORE (Operator)

> L'interfaccia Operatore condivide la stessa struttura visiva del Cliente (mappa full-screen, menu laterale ≡ in alto a sinistra, tasto GPS in basso a destra).
> **Differenza chiave:** la search bar "Dove vuoi andare?" è sostituita dal tasto "Segnalazioni".

---

### 8. HOME OPERATORE — Mappa Flotta

**Schermata:** `OperatorHomeScreen`
**Slice:** `FleetDistributionMap` (OP.01), `LowAvailabilityAlert` (OP.02), `IGpsTrackingService`

| Elemento | Posizione | Tipo | Comportamento |
|---|---|---|---|
| Mappa full-screen | Sfondo | Map view | Mostra **tutti i veicoli** della flotta con stato colorato |
| Legenda stati veicolo | In alto, overlay | Mini legend | AVAILABLE (verde) / MAINTENANCE (arancio) / OUT_OF_SERVICE (rosso) / IN_USE (blu) |
| Tasto "Segnalazioni 🔔" | In alto, centrato | Button primary con badge counter | Sostituisce la search bar → apre `MaintenancePanelSheet` dal basso |
| Menu laterale (hamburger ≡) | In alto a sinistra | Icon button | Sidebar operatore |
| Tasto centra mappa | In basso a destra | FAB GPS | Centra sulla posizione operatore |
| Pin veicoli colorati | Su mappa | Marker interattivi | Tap → apre `VehicleOperatorSheet` |
| Alert zona sotto soglia | Overlay su FleetZone | Banner rosso pulsante | LowAvailabilityAlert (OP.02) |

**Sidebar Operatore:**
| Voce | Slice |
|---|---|
| Coda manutenzione | `MaintenanceQueue` (OP.05) |
| Storico GPS veicolo | `VehicleGPSHistory` (OP.06) |
| Ticket supporto | `ManageSupportTickets` (OP.07) |
| Prenotazioni scadute | `ExpiredBookingsMonitor` (OP.11) |
| Configura bonus parcheggio | `ConfigureParkingBonus` (OP.08) |
| Gestione account utenti | `SuspendUserAccount` (OP.09) |
| Logout | `IAuthService` |

---

### 9. PANNELLO SEGNALAZIONI (bottom sheet operatore)

**Schermata:** `MaintenancePanelSheet`
**Slice:** `ReceiveMalfunctionReport` (OP.03), `MaintenanceQueue` (OP.05), `VerifyParkingPosition` (OP.04), `RemoteLockVehicle` (OP.10)

| Elemento | Tipo | Comportamento |
|---|---|---|
| Handle drag | Barra in cima | Swipe down → chiude |
| Tab "Da gestire / In corso / Risolte" | Tab selector | Filtra lista segnalazioni |
| Lista segnalazioni | Card list scrollabile | ID veicolo, tipo problema, severità, ora segnalazione |
| Badge severità | Chip colorato | CRITICAL = rosso / HIGH = arancio / MEDIUM = giallo / LOW = grigio |
| Tap su segnalazione | → sheet dettaglio | Descrizione, foto allegate, posizione su mini-mappa |
| Tasto "Blocca veicolo da remoto" | Button danger | `RemoteLockVehicle` (OP.10) → conferma modale |
| Tasto "Verifica parcheggio" | Button secondary | `VerifyParkingPosition` (OP.04) |
| Tasto "Segna in manutenzione" | Button primary | Cambia stato veicolo → MAINTENANCE |
| Tasto "Risolto" | Button success | Chiude la segnalazione |

---

### 10. DETTAGLIO VEICOLO (operatore)

**Schermata:** `VehicleOperatorSheet` (tap su pin mappa)
**Slice:** `VehicleDetails` (UT.06), `VehicleGPSHistory` (OP.06), `VehicleBatteryStatus` (UT.12)

| Elemento | Tipo | Comportamento |
|---|---|---|
| ID / Targa veicolo | Text large | Identificativo |
| Stato corrente | Badge colorato | AVAILABLE / IN_USE / MAINTENANCE… |
| Livello batteria | Progress bar + % | `VehicleBatteryStatus` (UT.12) |
| Ultima posizione GPS | Mini mappa statica | `IGpsTrackingService` |
| Storico posizioni | Tasto → sheet | `VehicleGPSHistory` (OP.06) |
| Ultima manutenzione | Text | Data + note |
| Tasto "Blocca da remoto" | Button danger | `RemoteLockVehicle` (OP.10) |
| Tasto "Apri segnalazione" | Button secondary | Pre-compila `VehicleConditionReport` |

---

## PROFILO: AMMINISTRAZIONE PUBBLICA (PublicAdministrationUser)

> Interfaccia orientata alla gestione territoriale e alla reportistica.
> Nessuna mappa di flotta operativa. La mappa è usata per zone e heatmap.

---

### 11. HOME ADMIN — Dashboard Mobilità

**Schermata:** `AdminDashboardScreen`
**Slice:** `UsageFrequencyReport` (AP.01), `MobilityPeriodicReport` (AP.02), `HighDensityZoneMap` (AP.04)

| Elemento | Tipo | Comportamento |
|---|---|---|
| Header con ruolo | Top bar | Logo + "Amministrazione Pubblica" + nome ente |
| KPI cards (riga superiore) | 3 card orizzontali | Corse totali / Veicoli attivi / Zone critiche — periodo selezionabile |
| Grafico utilizzo per tipo veicolo | Bar chart | Bici / Scooter / Auto per fascia oraria (AP.01) |
| Heatmap zona ad alta densità | Map view con layer | Zone colorate per intensità traffico (AP.04) |
| Selettore periodo | Date range picker | Filtra tutti i dati della dashboard |
| Tasto "Genera Report Periodico" | Button primary | Apre selezione periodo → genera PDF/CSV (AP.02) |
| Menu laterale (hamburger ≡) | In alto a sinistra | Sidebar admin |

**Sidebar Admin:**
| Voce | Slice |
|---|---|
| Dashboard mobilità | `UsageFrequencyReport` (AP.01) |
| Report periodici | `MobilityPeriodicReport` (AP.02) |
| Gestione zone sensibili | `DefineSensitiveZone` (AP.05) |
| Zona di allerta urbana | `MarkUrbanWarningZone` (AP.03) |
| Heatmap densità | `HighDensityZoneMap` (AP.04) |
| Logout | `IAuthService` |

---

### 12. GESTIONE ZONE

**Schermata:** `ZoneManagementScreen`
**Slice:** `DefineSensitiveZone` (AP.05), `MarkUrbanWarningZone` (AP.03)

| Elemento | Tipo | Comportamento |
|---|---|---|
| Mappa interattiva | Map view full | Zone esistenti con poligoni colorati per tipo |
| Legenda tipi zona | Overlay | ZTL / Pedonale / Scuola / Ospedale / Cantiere / Manutenzione |
| Tab "Permanenti / Temporanee" | Tab bar | Filtra vista e lista |
| Lista zone attive | Side panel o bottom sheet | Nome, tipo, data creazione, stato |
| Tasto "Nuova Zona" | FAB + | Apre form disegno poligono su mappa |
| Form nuova zona | Sheet | Nome, tipo (`ZoneType`), date validità (se temporanea), regole accesso |
| Tasto "Salva zona" | Button primary | `DefineSensitiveZone` (AP.05) o `MarkUrbanWarningZone` (AP.03) |
| Tap su zona esistente | → sheet dettaglio | Modifica / Disattiva zona |
| Tasto "Disattiva" | Button danger | `IZoneRepository.deactivate()` |

---

### 13. REPORT PERIODICI

**Schermata:** `PeriodicReportScreen`
**Slice:** `MobilityPeriodicReport` (AP.02), `UsageFrequencyReport` (AP.01)

| Elemento | Tipo | Comportamento |
|---|---|---|
| Selettore periodo | Date range picker | Settimana / Mese / Custom |
| Selettore tipo veicolo | Multi-select chip | Tutti / Bici / Scooter / Auto |
| Preview dati | Card con grafici | Totale corse, km percorsi, utenti unici |
| Tabella dati aggregati | Data table | Periodo / Tipo / Corse / Km / Ore utilizzo |
| Tasto "Esporta PDF" | Button primary | Genera report scaricabile |
| Tasto "Esporta CSV" | Button secondary | Export dati grezzi |
| Storico report generati | List | Data generazione + link download |

---

## MAPPA DEI FLUSSI — Navigazione tra schermate

```
LOGIN
 ├── Sign In ──────────────────────────── HOME (Customer / Operator / Admin)
 └── Sign Up → Onboarding [Slide1→2→3] ─┘

HOME CUSTOMER
 ├── Search bar → SearchDestinationSheet
 │    └── Seleziona veicolo → RoutePreviewScreen
 │         ├── Prenota → [RESERVED] → Sblocca → [IN_USE]
 │         │    ├── Pausa → [PAUSED] → Riprendi → [IN_USE]
 │         │    └── Fine corsa → RideSummaryScreen → Home
 │         └── Annulla → Home
 ├── Menu ≡ → Sidebar
 │    ├── Portafoglio → UserSettings (pagamenti)
 │    ├── Tariffe     → UserSettings (tariffe)
 │    ├── Promozioni  → UserSettings (promozioni)
 │    ├── Storico     → RideSummaryScreen (lista)
 │    └── Supporto    → OpenSupportTicket
 └── Pin veicolo → VehicleDetails sheet

HOME OPERATOR
 ├── Tasto Segnalazioni → MaintenancePanelSheet
 │    └── Tap segnalazione → Dettaglio → [Blocca / Verifica / Risolvi]
 ├── Menu ≡ → Sidebar operatore
 └── Pin veicolo → VehicleOperatorSheet

HOME ADMIN
 ├── Dashboard KPI + Heatmap
 └── Menu ≡ → Sidebar
      ├── Zone → ZoneManagementScreen
      └── Report → PeriodicReportScreen
```

---

## NOTE DI IMPLEMENTAZIONE UI

| Aspetto | Scelta consigliata |
|---|---|
| Mappa | Mapbox GL JS o Leaflet con tile OpenStreetMap |
| Bottom sheet | Animazione `translateY` con spring easing, handle drag |
| Autenticazione | JWT via `IAuthService`, ruolo decodificato → redirect corretto |
| Routing tra profili | Role check: `user.role` → `CUSTOMER` / `OPERATOR` / `PUBLIC_ADMIN` |
| Notifiche in-app | Banner top per alert LowAvailability (OP.02) e segnalazioni |
| Offline / errori | Empty state con messaggio + retry su ogni schermata dati |
| Accessibilità | Touch target ≥ 44px, WCAG AA contrasto, aria-label su bottoni icona |

---

*Documento generato a supporto della progettazione VSA — Vehicle Sharing Application*

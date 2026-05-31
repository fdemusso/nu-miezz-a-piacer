# Sprint plan — VSA platform

Stato di partenza (snapshot della migrazione):

- 32 slice scaffolded in `apps/api/src/slices/*` con i 3 file canonici (`*.types.ts`, `*.handler.ts`, `*.router.ts`). Tutti i router sono registrati in `apps/api/src/app.ts`.
- I contratti vivono in `packages/contracts/src/index.ts` (versione semplificata, **non** la versione "ricca" del documento `studio migrazione VSA.md` — quel doc è aspirazionale).
- 19 adapter base implementati in memoria (Map<string, Entity>) — vedi `essenziale.md`.
- Composition root (`apps/api/src/composition/container.ts`) wira un grafo completo di repo + service ed espone una mappa di dipendenze per slice.
- Tutti gli handler restituiscono ancora `{} as Response` — la logica non è scritta.

Quindi: l'infrastruttura è pronta, manca la **logica applicativa** + la **persistenza reale** + il **frontend**.

## Roadmap (5 sprint × ~1 settimana)

| Sprint | Tema | Slice |
|---|---|---|
| [Sprint 0](sprint-0.md) | Fondamenta (SQLite, DI, test, frontend skel) | — |
| [Sprint 1](sprint-1.md) | Customer: scoperta + tariffa + pagamento | UT.01, UT.03, UT.06, UT.07, UT.09, UT.12, UT.15 |
| [Sprint 2](sprint-2.md) | Ciclo di vita corsa | UT.02, UT.04, UT.05, UT.13, UT.14, UT.16, OP.11 |
| [Sprint 3](sprint-3.md) | Supporto, danni, sicurezza | UT.08, UT.10, UT.11, OP.03, OP.04, OP.05, OP.07, OP.09 |
| [Sprint 4](sprint-4.md) | Operatori + Pubblica Amministrazione | OP.01, OP.02, OP.06, OP.08, OP.10, AP.01–AP.05 |

Convenzione: **ogni slice = una PR**. Mai più di una slice toccata per PR. Mai import cross-slice.

## Definition of Done per slice

1. Handler implementato (con error path espliciti, niente `as Response`).
2. Router fa solo parse/validate/return — niente logica.
3. Test di slice (`<Slice>.test.ts`) con almeno: happy path + 1 error path. Usa adapter in-memory direttamente (no mock).
4. Tipi di richiesta/risposta in `<Slice>.types.ts` riferiti dal frontend tramite `@vsa/contracts`.
5. `tsc --noEmit` pulito a livello di workspace.
6. Aggiornamento di `sliceRegistry.ts` se cambia visibilità per ruolo.

Vedi `essenziale.md` per la lista distillata di cosa il documento di migrazione effettivamente impone come invarianti VSA.

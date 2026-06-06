import type { HistoryDeps, HistoryInput, HistoryOutput } from './History.types';
export declare function createHistoryHandler(deps: HistoryDeps): (input: HistoryInput) => Promise<HistoryOutput>;

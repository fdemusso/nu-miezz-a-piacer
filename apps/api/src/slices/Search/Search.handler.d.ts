import type { SearchDeps, SearchInput, SearchOutput } from './Search.types';
export declare function createSearchHandler(deps: SearchDeps): (input: SearchInput) => Promise<SearchOutput>;

import { ProfileDeps, GetProfileInput, GetProfileOutput } from './Profile.types';
export declare function createProfileHandler(deps: ProfileDeps): (input: GetProfileInput) => Promise<GetProfileOutput>;

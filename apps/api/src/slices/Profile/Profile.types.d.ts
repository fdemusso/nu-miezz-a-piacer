import type { IUserRepository, User } from '@mvp/contracts';
export interface GetProfileInput {
    userId: string;
}
export interface GetProfileOutput {
    profile: User;
}
export interface ProfileDeps {
    userRepo: IUserRepository;
}

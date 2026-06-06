import { ProfileDeps, GetProfileInput, GetProfileOutput } from './Profile.types';

export function createProfileHandler(deps: ProfileDeps) {
  return async (input: GetProfileInput): Promise<GetProfileOutput> => {
    const user = await deps.userRepo.findById(input.userId);
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }
    return { profile: user };
  };
}

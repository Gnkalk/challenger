'use server';

import { auth } from './auth';
import db from './db';

export const getChallenges = async () => {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Not logged in');

  return (await db()).query.challengeParticipants
    .findMany({
      where: ({ userId }, { eq }) => eq(userId, session.user?.id ?? ''),
      with: {
        challenge: {
          with: {
            challengeCreatedBy: true,
          },
        },
      },
    })
    .execute();
};

export type GetChallengesPromise = ReturnType<typeof getChallenges>;

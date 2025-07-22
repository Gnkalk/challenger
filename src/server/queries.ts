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

export const getChallenge = async (id: string) => {
  const session = await auth();

  const challenge = await (
    await db()
  ).query.challengesTable
    .findFirst({
      where: ({ id: challengeId }, { eq }) => eq(challengeId, id),
      with: {
        challengeCreatedBy: true,
        challengeDays: {
          with: {
            participants: {
              with: {
                participant: true,
              },
            },
          },
        },
        challengeParticipants: {
          with: {
            participant: true,
          },
        },
      },
    })
    .execute();

  if (!challenge) return null;

  const userCreateIt = session?.user?.id === challenge.createdBy;

  return {
    ...challenge,
    userCreateIt,
  };
};

export type GetChallengePromise = ReturnType<typeof getChallenge>;

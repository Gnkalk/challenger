'use server';

import 'server-only';
import { auth, signIn } from './auth';
import db from './db';
import { challengeParticipants, challengesTable } from './db/schema';
import { z } from 'zod/v4';
import { v4 as uuidv4 } from 'uuid';

export const loginWithGoogleAction = async () => {
  await signIn('google', { redirectTo: '/dashboard' });
};

export const loginWithGithubAction = async () => {
  await signIn('github', { redirectTo: '/dashboard' });
};

const createChallengeForm = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

export const createChallengeAction = async (_prevData: any, form: FormData) => {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Not logged in' };

  // const data =
  const { data, success } = createChallengeForm.safeParse(
    Object.fromEntries(form)
  );
  if (!success) return { error: 'Invalid data' };

  const challengeInsert = await (
    await db()
  )
    .insert(challengesTable)
    .values({
      name: data.name,
      description: data.description,
      createdBy: session.user?.id,
      plan: 'lorem ipsum',
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .execute();

  if (!challengeInsert) return { error: 'Failed to insert challenge' };

  const challenge = await (
    await db()
  ).query.challengesTable
    .findFirst({
      where: ({ createdBy }, { eq }) => eq(createdBy, session.user?.id ?? ''),
      orderBy: ({ createdAt }, { desc }) => desc(createdAt),
    })
    .execute();

  if (!challenge) return { error: 'Failed to add challenge' };

  await (
    await db()
  )
    .insert(challengeParticipants)
    .values({
      challengeId: challenge?.id,
      userId: session.user?.id,
    })
    .execute();

  return undefined;
};

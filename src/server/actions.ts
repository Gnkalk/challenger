'use server';

import 'server-only';
import { auth, signIn } from './auth';
import db from './db';
import {
  challengeDayParticipants,
  challengeDayTable,
  challengeParticipants,
  challengesTable,
  usersTable,
} from './db/schema';
import { z } from 'zod/v4';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const loginWithGoogleAction = async () => {
  await signIn('google', { redirectTo: '/dashboard' });
};

export const loginWithGithubAction = async () => {
  await signIn('github', { redirectTo: '/dashboard' });
};

const createChallengeForm = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  plan: z.string().min(1),
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
      plan: data.plan,
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

  revalidatePath('/dashboard');

  return undefined;
};

export const joinChallengeAction = async (challengeID: string) => {
  const session = await auth();
  if (!session?.user?.id) return { error: true, message: 'Not logged in' };

  const challenge = await (
    await db()
  ).query.challengeParticipants
    .findFirst({
      where: ({ userId, challengeId }, { eq, and }) =>
        and(eq(userId, session.user?.id ?? ''), eq(challengeId, challengeID)),
    })
    .execute();

  if (challenge) return { error: true, message: 'Already joined challenge' };

  await (
    await db()
  )
    .insert(challengeParticipants)
    .values({
      challengeId: challengeID,
      userId: session.user?.id,
    })
    .execute();

  revalidatePath('/dashboard');

  return { error: false };
};

export const doneChallengeAction = async (challengeID: string) => {
  const session = await auth();
  if (!session?.user?.id) return { error: true, message: 'Not logged in' };

  const challenge = await (
    await db()
  ).query.challengeParticipants
    .findFirst({
      where: ({ userId, challengeId }, { eq, and }) =>
        and(eq(userId, session.user?.id ?? ''), eq(challengeId, challengeID)),

      with: {
        challenge: true,
      },
    })
    .execute();

  if (!challenge) return { error: true, message: 'Not joined challenge' };

  const startOfDay = new Date().setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date().setUTCHours(23, 59, 59, 999);

  let challengeDay = await (
    await db()
  ).query.challengeDayTable
    .findFirst({
      where: ({ challengeId, date }, { eq, and, between }) =>
        and(
          eq(challengeId, challengeID),
          between(date, new Date(startOfDay), new Date(endOfDay))
        ),
    })
    .execute();

  if (!challengeDay) {
    await (
      await db()
    )
      .insert(challengeDayTable)
      .values({
        day: challenge.challenge.day + 1,
        challengeId: challengeID,
        date: new Date(),
      })
      .execute();

    await (
      await db()
    )
      .update(challengesTable)
      .set({
        day: challenge.challenge.day + 1,
      })
      .where(eq(challengesTable.id, challengeID))
      .execute();
    challengeDay = await (
      await db()
    ).query.challengeDayTable
      .findFirst({
        where: ({ challengeId, date }, { eq, and }) =>
          and(eq(challengeId, challengeID), eq(date, new Date())),
      })
      .execute();
  }

  try {
    await (
      await db()
    )
      .insert(challengeDayParticipants)
      .values({
        challengeDayId: challengeDay?.id!,
        userId: session.user.id,
      })
      .execute();
  } finally {
    revalidatePath('/dashboard');

    return { error: false };
  }
};

export const deleteChallengeAction = async (challengeID: string) => {
  const session = await auth();
  if (!session?.user?.id) return { error: true, message: 'Not logged in' };

  await (await db())
    .delete(challengesTable)
    .where(eq(challengesTable.id, challengeID))
    .execute();

  revalidatePath('/dashboard');
  redirect('/');
};

export const updateChallengeAction = async (_prevData: any, form: FormData) => {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Not logged in' };

  const challengeID = form.get('challengeID') as string | null;
  if (!challengeID) return { error: 'Invalid challenge ID' };

  await (
    await db()
  )
    .update(challengesTable)
    .set({
      name: form.get('name') as string,
      description: form.get('description') as string,
      plan: form.get('plan') as string,
    })
    .where(eq(challengesTable.id, challengeID))
    .execute();

  revalidatePath('/dashboard');

  return undefined;
};

export const changeUserLocaleAction = async (locale: 'en' | 'fa') => {
  const session = await auth();
  if (!session?.user?.id) return { error: true, message: 'Not logged in' };

  await (
    await db()
  )
    .update(usersTable)
    .set({
      locale,
    })
    .where(eq(usersTable.id, session.user?.id))
    .execute();

  revalidatePath('/dashboard');

  return { error: false, message: 'Language changed' };
};

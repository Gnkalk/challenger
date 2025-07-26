import NextAuth, { DefaultSession } from 'next-auth';
import { NextAuthResult } from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import db from './db';
import {
  authenticatorsTable,
  sessionsTable,
  usersTable,
  accountsTable,
} from './db/schema';

declare module 'next-auth' {
  interface Session {
    user: {
      locale: 'en' | 'fa';
    } & DefaultSession['user'];
  }
}

const authResult = async (): Promise<NextAuthResult> => {
  return NextAuth({
    providers: [
      GitHub({
        clientId: (await getCloudflareContext({ async: true })).env
          .AUTH_GITHUB_ID,
        clientSecret: (await getCloudflareContext({ async: true })).env
          .AUTH_GITHUB_SECRET,
      }),
      Google({
        clientId: (await getCloudflareContext({ async: true })).env
          .AUTH_GOOGLE_ID,
        clientSecret: (await getCloudflareContext({ async: true })).env
          .AUTH_GOOGLE_SECRET,
      }),
    ],
    adapter: DrizzleAdapter(await db(), {
      accountsTable,
      sessionsTable,
      usersTable,
      authenticatorsTable,
    }),
  });
};

export const { handlers, signIn, signOut, auth } = await authResult();

import NextAuth from 'next-auth';
import { NextAuthResult } from 'next-auth';
import { D1Adapter } from '@auth/d1-adapter';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import GitHub from 'next-auth/providers/github';

const authResult = async (): Promise<NextAuthResult> => {
  return NextAuth({
    providers: [
      GitHub({
        clientId: (await getCloudflareContext({ async: true })).env
          .AUTH_GITHUB_ID,
        clientSecret: (await getCloudflareContext({ async: true })).env
          .AUTH_GITHUB_SECRET,
      }),
    ],
    adapter: D1Adapter((await getCloudflareContext({ async: true })).env.DB),
  });
};

export const { handlers, signIn, signOut, auth } = await authResult();

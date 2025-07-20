'use server';
import { signIn } from './auth';

export const loginWithGoogleAction = async () => {
  await signIn('google', { redirectTo: '/dashboard' });
};

export const loginWithGithubAction = async () => {
  await signIn('github', { redirectTo: '/dashboard' });
};

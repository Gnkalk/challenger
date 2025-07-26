import React from 'react';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { auth, signOut } from '@/server/auth';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { redirect } from 'next/navigation';
import { changeUserLocaleAction } from '@/server/actions';
import { ActionButton } from './ui/action-button';

export default async function ProfileCard() {
  const session = await auth();
  if (!session) redirect('/login');

  return (
    <Card className="py-4">
      <CardContent className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Avatar className="rounded-lg">
            <AvatarImage src={session?.user?.image!} />
            <AvatarFallback className="rounded-lg">
              {session?.user?.name ?? 'P'}
            </AvatarFallback>
          </Avatar>
          {session.user && (
            <div className="flex gap-2">
              <ActionButton
                size="sm"
                className="text-xs p-1"
                variant="outline"
                action={changeUserLocaleAction.bind(
                  null,
                  session.user.locale === 'en' ? 'fa' : 'en'
                )}
              >
                {session.user.locale === 'en' ? 'FA' : 'EN'}
              </ActionButton>
              <p className="text-xl font-bold mt-0.5">{session?.user?.name}</p>
            </div>
          )}
        </div>
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/login' });
          }}
        >
          <Button size="icon">
            <LogOut />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

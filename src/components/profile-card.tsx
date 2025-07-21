import React from 'react';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { auth, signOut } from '@/server/auth';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function ProfileCard() {
  const session = await auth();
  if (!session) redirect('/login');

  return (
    <Card className="py-4">
      <CardContent className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar className="rounded-lg">
            <AvatarImage src={session?.user?.image!} />
            <AvatarFallback className="rounded-lg">
              {session?.user?.name ?? 'P'}
            </AvatarFallback>
          </Avatar>
          <div className="text-xl font-bold">{session?.user?.name}</div>
        </div>
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/login' });
          }}
        >
          <Button>
            <LogOut />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

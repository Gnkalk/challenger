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
    <Card className="shadow-md">
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-14 sm:size-16 rounded-xl border-2 border-border">
              <AvatarImage
                src={session?.user?.image || undefined}
                alt={session?.user?.name || 'User'}
                className="object-cover"
              />
              <AvatarFallback className="rounded-xl text-lg font-semibold bg-primary/10 text-primary">
                {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {session?.user?.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {session?.user?.email}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/login' });
              }}
            >
              <Button variant="outline" size="sm" className="gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Language
            </span>
            <form
              action={async () => {
                'use server';
                await changeUserLocaleAction(
                  session.user!.locale === 'en' ? 'fa' : 'en'
                );
              }}
            >
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="text-xs px-4 py-2 rounded-lg transition-smooth hover:bg-accent"
              >
                {session.user?.locale === 'fa' ? 'فارسی' : 'English'}
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

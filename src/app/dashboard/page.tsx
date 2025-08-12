import CalendarEvent from '@/components/calendar-event';
import ChallengeCalendar from '@/components/challenge';
import ChallengesList from '@/components/challenges-list';
import ProfileCard from '@/components/profile-card';
import { Card, CardContent } from '@/components/ui/card';
import { auth } from '@/server/auth';
import { getChallenge, getChallenges } from '@/server/queries';
import { Suspense } from 'react';

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const challengesPromise = getChallenges();
  const currentChallenge = (await searchParams).challenge ?? '';
  const challenge = getChallenge(currentChallenge);

  const session = await auth();

  return (
    <div className="min-h-svh bg-gradient-to-br from-background via-background to-muted/20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800/50">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <header className="mb-10 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
            Welcome back,{' '}
            <span className="text-gradient">{session?.user?.name}</span>!
          </h1>
          <p className="text-lg text-muted-foreground mt-3 max-w-2xl">
            Track your progress and join new challenges to achieve your goals.
            Stay motivated and see how far you've come!
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-4">
            <ProfileCard />
            <CalendarEvent
              getChallenges={challengesPromise}
              locale={session?.user?.locale!}
            />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <Card className="shadow-md">
              <CardContent className="p-6 sm:p-8">
                <Suspense
                  fallback={
                    <div className="text-center py-8 text-muted-foreground">
                      Loading challenges...
                    </div>
                  }
                >
                  <ChallengesList
                    promise={challengesPromise}
                    challenge={challenge}
                  />
                </Suspense>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6 sm:p-8">
                <ChallengeCalendar
                  challenge={challenge}
                  locale={session?.user?.locale!}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

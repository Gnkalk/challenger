import CalendarEvent from '@/components/calendar-event';
import ChallengeCalendar from '@/components/challenge';
import ChallengesList from '@/components/challenges-list';
import ProfileCard from '@/components/profile-card';
import { Card, CardContent } from '@/components/ui/card';
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

  return (
    <div className="flex items-center justify-center gap-6 w-full min-h-svh overflow-auto py-4">
      <div className="grid gap-y-2 md:gap-x-2 md:grid-cols-3 max-md:px-4">
        <div className="space-y-2 w-full">
          <ProfileCard />
          <CalendarEvent getChallenges={challengesPromise} />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <Card className="flex-1 py-2">
            <CardContent className="px-2">
              <Suspense>
                <ChallengesList
                  promise={challengesPromise}
                  challenge={challenge}
                />
              </Suspense>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <ChallengeCalendar challenge={challenge} />
          </Card>
        </div>
      </div>
    </div>
  );
}

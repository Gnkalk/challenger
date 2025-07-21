import CalendarEvent from '@/components/calendar-event';
import ChallengesList from '@/components/challenges-list';
import ProfileCard from '@/components/profile-card';
import { Card, CardContent } from '@/components/ui/card';
import { getChallenges } from '@/server/queries';
import { Suspense } from 'react';

export default async function Dashboard() {
  const challengesPromise = getChallenges();

  return (
    <div className="flex items-center justify-center gap-6 w-full h-svh">
      <div className="grid gap-2 md:grid-cols-3">
        <div className="space-y-2">
          <ProfileCard />
          <CalendarEvent getChallenges={challengesPromise} />
        </div>
        <div className="flex flex-col gap-2 col-span-2">
          <Card className="flex-1 py-2">
            <CardContent className="px-2">
              <Suspense>
                <ChallengesList promise={challengesPromise} />
              </Suspense>
            </CardContent>
          </Card>
          <Card className="flex-1"></Card>
        </div>
      </div>
    </div>
  );
}

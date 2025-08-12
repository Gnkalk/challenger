'use client';

import { CheckCircle, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import CreateNewChallenge from './create-new-challenge';
import { Skeleton } from './ui/skeleton';
import { memo, Suspense, use } from 'react';
import { GetChallengesPromise } from '@/server/queries';
import { doneChallengeAction } from '@/server/actions';
import { ActionButton } from './ui/action-button';
import { enUS } from 'react-day-picker/locale';
import { faIR } from 'react-day-picker/persian';

export default function CalendarEvent({
  getChallenges,
  locale,
}: {
  getChallenges: GetChallengesPromise;
  locale: 'en' | 'fa';
}) {
  return (
    <Card className="w-full shadow-md">
      <CardContent className="p-6 mx-auto">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-foreground">Today's Date</h3>
        </div>
        <Calendar
          mode="single"
          selected={new Date()}
          hideNavigation
          locale={locale === 'en' ? enUS : faIR}
          weekStartsOn={locale === 'en' ? 0 : 6}
          onSelect={() => {}}
          components={{
            MonthCaption: () => <p></p>,
          }}
          className="bg-transparent p-0"
          required
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-6 border-t p-6">
        <div className="flex w-full items-center justify-between px-1">
          <div className="text-base font-bold text-foreground">
            Today's Challenges
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="gap-2 transition-smooth hover:bg-primary/90"
                title="Create new challenge"
              >
                <PlusIcon className="w-4 h-4" />
                New Challenge
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <Suspense fallback={<Skeleton className="h-24" />}>
                <CreateNewChallenge />
              </Suspense>
            </DialogContent>
          </Dialog>
        </div>
        <Suspense fallback={<Skeleton className="h-24" />}>
          <MemorizedChallenges promise={getChallenges} />
        </Suspense>
      </CardFooter>
    </Card>
  );
}

const MemorizedChallenges = memo(Challenges);

function Challenges({ promise }: { promise: GetChallengesPromise }) {
  const challenges = use(promise);

  if (challenges.length === 0) {
    return (
      <div className="text-center text-muted-foreground text-base">
        No challenges for today
      </div>
    );
  }

  const openChallenges = challenges.filter(
    (challenge) => challenge.challenge.status === 'open'
  );

  if (openChallenges.length === 0) {
    return (
      <div className="text-center text-muted-foreground text-base">
        All challenges completed! 🎉
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3 max-h-48 overflow-auto noscrollbar pr-2">
      {openChallenges.map((challenge) => (
        <div
          key={challenge.challenge.id}
          className="bg-muted/50 hover:bg-muted/70 transition-smooth after:bg-primary/70 relative rounded-lg p-4 pl-8 text-sm after:absolute after:inset-y-2 after:left-3 after:w-1.5 after:rounded-full border border-border/50"
        >
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-foreground truncate">
                {challenge.challenge.name}
              </div>
              <div className="text-muted-foreground text-xs mt-1.5">
                By {challenge.challenge.challengeCreatedBy.name}
              </div>
            </div>
            <ActionButton
              size="sm"
              variant="outline"
              className="flex-shrink-0 transition-smooth"
              action={doneChallengeAction.bind(null, challenge.challenge.id)}
              title="Mark as completed"
            >
              Done
              <CheckCircle className="w-4 h-4" />
            </ActionButton>
          </div>
        </div>
      ))}
    </div>
  );
}

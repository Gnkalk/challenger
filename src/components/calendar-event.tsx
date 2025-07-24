'use client';

import { CheckCircle, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import CreateNewChallenge from './create-new-challenge';
import { Skeleton } from './ui/skeleton';
import { memo, Suspense, use, useActionState, useCallback } from 'react';
import { GetChallengesPromise } from '@/server/queries';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { doneChallengeAction } from '@/server/actions';

export default function CalendarEvent({
  getChallenges,
}: {
  getChallenges: GetChallengesPromise;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return (
    <Card className="w-full py-4">
      <CardContent className="px-4">
        <Calendar
          mode="single"
          defaultMonth={new Date(searchParams.get('date') ?? new Date())}
          selected={new Date(searchParams.get('date') ?? new Date())}
          onSelect={(date) => {
            router.push(
              pathname + '?' + createQueryString('date', date.toDateString())
            );
          }}
          className="bg-transparent p-0"
          required
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 border-t px-4 !pt-4">
        <div className="flex w-full items-center justify-between px-1">
          <div className="text-sm font-medium">Challenges</div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-6"
                title="Make challenge"
              >
                <PlusIcon />
                <span className="sr-only">Make challenge</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <Suspense fallback={<Skeleton className="h-24" />}>
                <CreateNewChallenge />
              </Suspense>
            </DialogContent>
          </Dialog>
        </div>
        <Suspense fallback={<Skeleton className="h-20" />}>
          <MemorizedChallenges promise={getChallenges} />
        </Suspense>
      </CardFooter>
    </Card>
  );
}

const MemorizedChallenges = memo(Challenges);

function Challenges({ promise }: { promise: GetChallengesPromise }) {
  const challenges = use(promise);

  return (
    <div className="flex w-full flex-col gap-2 max-h-28 overflow-auto noscrollbar">
      {challenges
        .filter((challenge) => challenge.challenge.status === 'open')
        .map((challenge) => (
          <div
            key={challenge.challenge.id}
            className="bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{challenge.challenge.name}</div>
                <div className="text-muted-foreground text-xs max-w-40">
                  By {challenge.challenge.challengeCreatedBy.name}
                </div>
              </div>
              <ChallengeForm id={challenge.challenge.id} />
            </div>
          </div>
        ))}
    </div>
  );
}

function ChallengeForm({ id }: { id: string }) {
  const [state, action, isPending] = useActionState(
    doneChallengeAction,
    undefined
  );

  return (
    <form action={action}>
      <input type="hidden" name="challengeID" value={id} />
      <Button
        size="sm"
        variant={state?.error ? 'destructive' : 'outline'}
        loading={isPending}
      >
        <CheckCircle />
      </Button>
    </form>
  );
}

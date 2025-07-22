'use client';
import { Calendar } from './ui/calendar';
import { useSearchParams } from 'next/navigation';
import { GetChallengePromise } from '@/server/queries';
import { use, useActionState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { deleteChallengeAction } from '@/server/actions';

export default function challenge({
  challenge: challengePromise,
}: {
  challenge: GetChallengePromise;
}) {
  const challenge = use(challengePromise);
  const searchParams = useSearchParams();
  const date = new Date(searchParams.get('date')!);

  const [_state, deleteChallenge, isDeletingChallenge] = useActionState(
    deleteChallengeAction,
    undefined
  );

  return (
    <div>
      <Calendar
        className="bg-transparent p-0"
        month={date}
        classNames={{
          root: 'p-0',
        }}
        hideNavigation
        components={{
          MonthCaption: ({}) => <div></div>,
          Nav: ({}) => <div></div>,
          Day: ({ day: { date } }) => (
            <td
              className="relative w-full h-full p-0 text-center [&amp;:first-child[data-selected=true]_button]:rounded-l-md [&amp;:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none rdp-day text-muted-foreground aria-selected:text-muted-foreground rdp-outside border-l border-accent"
              role="gridcell"
            >
              <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                {challenge?.challengeDays
                  .find(
                    (day) =>
                      day.date.setUTCHours(0, 0, 0, 0) ===
                      date.setUTCHours(0, 0, 0, 0)
                  )
                  ?.participants.map((participant) => (
                    <Avatar key={participant.participant.id}>
                      <AvatarImage src={participant.participant.image!} />
                      <AvatarFallback>
                        {participant.participant.name}
                      </AvatarFallback>
                    </Avatar>
                  ))}
              </div>
            </td>
          ),
        }}
      />
      <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale px-4 items-center">
        <span className="mr-4">Particepents:</span>
        {challenge?.challengeParticipants.map((participant) => (
          <Avatar key={participant.participant.id}>
            <AvatarImage src={participant.participant.image!} />
            <AvatarFallback>{participant.participant.name}</AvatarFallback>
          </Avatar>
        ))}
        {challenge?.userCreateIt && (
          <form action={deleteChallenge} method="POST">
            <input type="hidden" name="challengeID" value={challenge.id} />
            <Button
              size="sm"
              variant="destructive"
              loading={isDeletingChallenge}
            >
              Delete
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

'use client';
import { Calendar } from './ui/calendar';
import { useSearchParams } from 'next/navigation';
import { GetChallengePromise } from '@/server/queries';
import { use, useActionState, useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { deleteChallengeAction, updateChallengeAction } from '@/server/actions';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { MarkdownEditor } from './md-editor';
import { isSameDay } from 'date-fns';

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

  const [markdown, setMarkdown] = useState('');
  const [state, updateChallenge, isUpdatingChallenge] = useActionState(
    updateChallengeAction,
    undefined
  );

  useEffect(() => {
    setMarkdown(challenge?.plan ?? '');
  }, [challenge?.plan]);

  return (
    <div>
      <Calendar
        className="bg-transparent p-0"
        classNames={{
          root: 'p-0',
        }}
        components={{
          Day: ({ day: { date } }) => (
            <td
              className="relative w-full h-full p-0 text-center [&amp;:first-child[data-selected=true]_button]:rounded-l-md [&amp;:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none rdp-day text-muted-foreground aria-selected:text-muted-foreground rdp-outside border-l border-accent"
              role="gridcell"
            >
              <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale relative">
                <span className="absolute text-5xl opacity-20">
                  {date.getUTCDate()}
                </span>
                {challenge?.challengeDays
                  .find((day) => isSameDay(day.date, date))
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
          <>
            <form action={deleteChallenge}>
              <input type="hidden" name="challengeID" value={challenge.id} />
              <Button
                size="sm"
                variant="destructive"
                loading={isDeletingChallenge}
              >
                Delete
              </Button>
            </form>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className="ml-4"
                  title="update challenge"
                >
                  Update
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form className="space-y-4" action={updateChallenge}>
                  <input
                    type="hidden"
                    name="challengeID"
                    value={challenge.id}
                  />
                  <DialogHeader>
                    <DialogTitle>Update challenge</DialogTitle>
                    <DialogDescription>
                      upadte challenge to start tracking your progress
                      {state?.error && (
                        <>
                          <br />
                          <span className="text-destructive">
                            {state?.error}
                          </span>
                        </>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="name-1">Name</Label>
                      <Input
                        id="name-1"
                        defaultValue={challenge.name}
                        name="name"
                        placeholder='e.g. "My first challenge"'
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="username-1">Description</Label>
                      <Textarea
                        name="description"
                        id="description-1"
                        defaultValue={challenge.description}
                        placeholder='e.g. "sss"'
                      />
                    </div>
                    <input type="hidden" name="plan" value={markdown} />
                    <MarkdownEditor
                      value={markdown}
                      onChange={(value) => setMarkdown(value ?? '')}
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" loading={isUpdatingChallenge}>
                      Update
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
}

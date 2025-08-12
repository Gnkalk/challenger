'use client';
import { Calendar } from './ui/calendar';
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
import { ActionButton } from './ui/action-button';
import { enUS } from 'react-day-picker/locale';
import { faIR } from 'react-day-picker/persian';

export default function challenge({
  challenge: challengePromise,
  locale,
}: {
  challenge: GetChallengePromise;
  locale: 'en' | 'fa';
}) {
  const challenge = use(challengePromise);
  const [markdown, setMarkdown] = useState('');
  const [state, updateChallenge, isUpdatingChallenge] = useActionState(
    updateChallengeAction,
    undefined
  );

  useEffect(() => {
    setMarkdown(challenge?.plan ?? '');
  }, [challenge?.plan]);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-foreground mb-6">
          Challenge Calendar
        </h3>
        <Calendar
          className="bg-transparent p-0"
          classNames={{
            root: 'p-0',
          }}
          locale={locale === 'en' ? enUS : faIR}
          weekStartsOn={locale === 'en' ? 0 : 6}
          components={{
            Day: ({ day: { date }, children }) => (
              <td
                className="relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none rdp-day text-muted-foreground aria-selected:text-muted-foreground rdp-outside border-l border-accent"
                role="gridcell"
              >
                <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale relative">
                  <span className="absolute text-5xl opacity-20">
                    {children}
                  </span>
                  {challenge?.challengeDays
                    .find((day) => isSameDay(day.date, date))
                    ?.participants.map((participant) => (
                      <Avatar
                        key={participant.participant.id}
                        className="size-8 rounded-full border-2 border-background"
                      >
                        <AvatarImage src={participant.participant.image!} />
                        <AvatarFallback className="text-xs">
                          {participant.participant.name}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                </div>
              </td>
            ),
          }}
        />
      </div>

      <div className="*:data-[slot=avatar]:ring-background flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-6 bg-card rounded-xl border border-border">
        <div className="flex-1">
          <h4 className="font-bold text-foreground mb-3">
            Participants ({challenge?.challengeParticipants.length || 0})
          </h4>
          <div className="flex flex-wrap gap-3">
            {challenge?.challengeParticipants.map((participant) => (
              <Avatar
                key={participant.participant.id}
                className="size-9 rounded-full border-2 border-background"
              >
                <AvatarImage src={participant.participant.image!} />
                <AvatarFallback className="text-xs font-medium">
                  {participant.participant.name}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>

        {challenge?.userCreateIt && (
          <div className="flex gap-3">
            <ActionButton
              size="sm"
              variant="destructive"
              requireAreYouSure
              action={deleteChallengeAction.bind(null, challenge.id)}
            >
              Delete
            </ActionButton>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className="gap-2 transition-smooth hover:bg-primary/90"
                  title="update challenge"
                >
                  <span>Update</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <form className="space-y-6" action={updateChallenge}>
                  <input
                    type="hidden"
                    name="challengeID"
                    value={challenge.id}
                  />
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                      Update challenge
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      Update challenge to start tracking your progress
                      {state?.error && (
                        <>
                          <br />
                          <span className="text-destructive font-medium">
                            {state?.error}
                          </span>
                        </>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="name-1" className="font-medium">
                        Name
                      </Label>
                      <Input
                        id="name-1"
                        defaultValue={challenge.name}
                        name="name"
                        placeholder='e.g. "My first challenge"'
                        className="input-field"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="username-1" className="font-medium">
                        Description
                      </Label>
                      <Textarea
                        name="description"
                        id="description-1"
                        defaultValue={challenge.description}
                        placeholder='e.g. "A brief description"'
                        className="input-field min-h-[100px]"
                      />
                    </div>
                    <input type="hidden" name="plan" value={markdown} />
                    <div>
                      <Label className="font-medium mb-2 block">Plan</Label>
                      <MarkdownEditor
                        value={markdown}
                        onChange={(value) => setMarkdown(value ?? '')}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        className="transition-smooth hover:bg-accent"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" loading={isUpdatingChallenge}>
                      Update Challenge
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}

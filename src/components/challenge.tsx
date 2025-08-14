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
import { isSameDay, isSameMonth } from 'date-fns';
import { ActionButton } from './ui/action-button';
import { enUS } from 'react-day-picker/locale';
import { faIR, getDateLib } from 'react-day-picker/persian';
import { cn } from '@/lib/utils';

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
  const [month, setMonth] = useState(new Date());

  useEffect(() => {
    setMarkdown(challenge?.plan ?? '');
  }, [challenge?.plan]);

  return (
    <div className="space-y-2">
      <div className="bg-card rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Challenge Calendar
        </h3>
        <Calendar
          className="bg-transparent p-0"
          classNames={{
            root: 'p-0',
            weekdays: 'flex gap-2 max-md:hidden',
            weeks: 'space-y-2',
            week: 'flex flex-col md:flex-row gap-2',
          }}
          locale={locale === 'en' ? enUS : faIR}
          weekStartsOn={locale === 'en' ? 0 : 6}
          month={month}
          onMonthChange={(date) => setMonth(date)}
          components={{
            Day: ({ day: { date }, children }) => (
              <td
                className={cn(
                  'max-md:h-16 relative w-full text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none rdp-day text-muted-foreground aria-selected:text-muted-foreground rdp-outside border border-accent p-4 rounded-lg',
                  locale === 'fa' && !getDateLib().isSameMonth(date, month)
                    ? 'max-md:hidden'
                    : !isSameMonth(date, month) && 'max-md:hidden'
                )}
                role="gridcell"
              >
                <div className="md:h-36 *:data-[slot=avatar]:ring-background flex md:flex-col flex-wrap -space-y-1 *:data-[slot=avatar]:ring-1 *:data-[slot=avatar]:grayscale relative">
                  <span className="absolute md:text-4xl opacity-20">
                    {children}
                  </span>
                  {challenge?.challengeDays
                    .find((day) => isSameDay(day.date, date))
                    ?.participants.map((participant) => (
                      <Avatar
                        key={participant.participant.id}
                        className="size-8 rounded-full border border-background"
                      >
                        <AvatarImage src={participant.participant.image!} />
                        <AvatarFallback className="text-xs">
                          {participant.participant.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                </div>
              </td>
            ),
          }}
        />
      </div>

      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-foreground">
            Participants ({challenge?.challengeParticipants.length || 0})
          </h4>
          {challenge?.userCreateIt && (
            <div className="flex gap-2">
              <ActionButton
                size="sm"
                variant="ghost"
                requireAreYouSure
                action={deleteChallengeAction.bind(null, challenge.id)}
                className="p-2"
              >
                <span className="sr-only">Delete</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </ActionButton>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2"
                    title="update challenge"
                  >
                    <span className="sr-only">Update</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
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
                          className=" min-h-[100px]"
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
        <div className="flex gap-2 overflow-x-auto pb-2 noscrollbar">
          {challenge?.challengeParticipants.map((participant) => (
            <Avatar
              key={participant.participant.id}
              className="flex-shrink-0 size-8 rounded-full border border-background"
            >
              <AvatarImage src={participant.participant.image!} />
              <AvatarFallback className="text-xs">
                {participant.participant.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
    </div>
  );
}

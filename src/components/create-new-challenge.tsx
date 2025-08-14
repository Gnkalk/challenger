'use client';

import { createChallengeAction } from '@/server/actions';
import { Button } from './ui/button';
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useActionState, useState } from 'react';
import { MarkdownEditor } from './md-editor';

export default function CreateNewChallenge() {
  const [state, action, isPending] = useActionState(
    createChallengeAction,
    undefined
  );
  const [markdown, setMarkdown] = useState('');

  return (
    <form className="space-y-8" action={action}>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">
          Create a New Challenge
        </DialogTitle>
        <DialogDescription className="text-base">
          Start a new challenge to build better habits and achieve your goals
          with a supportive community.
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

      <div className="space-y-8">
        <div className="space-y-6">
          <div className="grid gap-4">
            <Label htmlFor="name-1" className="font-medium">
              Challenge Name
            </Label>
            <Input
              id="name-1"
              name="name"
              placeholder="e.g., '30 Days of Coding', 'Daily Meditation', 'Read 10 Pages a Day'"
              className="h-12"
            />
          </div>

          <div className="grid gap-4">
            <Label htmlFor="description-1" className="font-medium">
              Description
            </Label>
            <Textarea
              name="description"
              id="description-1"
              placeholder="Briefly describe your challenge and what participants can expect"
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="grid gap-4">
            <Label htmlFor="plan-1" className="font-medium">
              Challenge Plan
            </Label>
            <div className="text-sm text-muted-foreground mb-3">
              Describe the daily activities or goals for this challenge
            </div>
            <input type="hidden" name="plan" value={markdown} />
            <MarkdownEditor
              value={markdown}
              onChange={(value) => setMarkdown(value ?? '')}
            />
          </div>
        </div>
      </div>

      <DialogFooter className="flex gap-3">
        <DialogClose asChild>
          <Button
            variant="outline"
            className="px-6 transition-smooth hover:bg-accent"
          >
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" loading={isPending} className="px-6">
          Create Challenge
        </Button>
      </DialogFooter>
    </form>
  );
}

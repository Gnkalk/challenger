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
import { useActionState } from 'react';

export default function CreateNewChallenge() {
  const [state, action, isPending] = useActionState(
    createChallengeAction,
    undefined
  );

  return (
    <form className="space-y-4" action={action}>
      <DialogHeader>
        <DialogTitle>Make a new challenge</DialogTitle>
        <DialogDescription>
          Create a new challenge to start tracking your progress
          {state?.error && (
            <>
              <br />
              <span className="text-destructive">{state?.error}</span>
            </>
          )}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="name-1">Name</Label>
          <Input
            id="name-1"
            name="name"
            placeholder='e.g. "My first challenge"'
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="username-1">Description</Label>
          <Textarea
            name="description"
            id="description-1"
            placeholder='e.g. "sss"'
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit" loading={isPending}>
          Save changes
        </Button>
      </DialogFooter>
    </form>
  );
}

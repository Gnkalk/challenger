'use client';

import { useActionState } from 'react';
import { Button } from './ui/button';
import { joinChallengeAction } from '@/server/actions';

export default function JoinChallenge({
  challengeID,
}: {
  challengeID: string;
}) {
  const [state, joinChallenge, isJoiningChallenge] = useActionState(
    joinChallengeAction,
    undefined
  );

  return (
    <form className="w-full" action={joinChallenge} method="POST">
      <input type="hidden" name="challengeID" value={challengeID} />
      <Button className="w-full" loading={isJoiningChallenge}>
        Challenge your self with others
      </Button>
      {state?.error && (
        <p className="text-destructive text-center mt-2">{state.error}</p>
      )}
    </form>
  );
}

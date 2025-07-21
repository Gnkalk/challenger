'use client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GetChallengesPromise } from '@/server/queries';
import { use, useState } from 'react';

export default function ChallengesList({
  promise,
}: {
  promise: GetChallengesPromise;
}) {
  const challenges = use(promise);
  const [tab, setTab] = useState(challenges[0].challenge.id);

  return (
    <>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          {challenges.map((challenge) => (
            <TabsTrigger
              value={challenge.challenge.id}
              key={challenge.challenge.id}
            >
              {challenge.challenge.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </>
  );
}

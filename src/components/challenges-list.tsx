'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GetChallengesPromise } from '@/server/queries';
import { use, useState } from 'react';
import { Button } from './ui/button';
import { Share } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Markdown } from './md-editor';

export default function ChallengesList({
  promise,
}: {
  promise: GetChallengesPromise;
}) {
  const challenges = use(promise);
  const [tab, setTab] = useState(0);

  const router = useRouter();

  return (
    <>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          {challenges.map((challenge, id) => (
            <TabsTrigger value={id} key={challenge.challenge.id}>
              {challenge.challenge.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={tab}>
          <div className="px-2">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl capitalize font-bold">
                  {challenges[tab].challenge.name}
                </h2>
                <p className="text-muted-foreground text-xs max-w-40">
                  By {challenges[tab].challenge.challengeCreatedBy.name}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-6"
                onClick={() =>
                  router.push(`/join/${challenges[tab].challenge.id}`)
                }
              >
                <Share />
              </Button>
            </div>

            <Markdown
              source={challenges[tab].challenge.plan}
              className="mt-2"
            />
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

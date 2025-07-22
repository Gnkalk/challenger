'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GetChallengePromise, GetChallengesPromise } from '@/server/queries';
import { use, useCallback, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Share } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Markdown } from './md-editor';

export default function ChallengesList({
  promise,
  challenge,
}: {
  promise: GetChallengesPromise;
  challenge: GetChallengePromise;
}) {
  const challenges = use(promise);
  const seletedChallenge = use(challenge);

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

  useEffect(() => {
    if (!searchParams.get('challenge')) {
      router.push(
        pathname +
          '?' +
          createQueryString('challenge', challenges[0].challenge.id)
      );
    }
  }, []);

  return (
    <>
      <Tabs
        value={searchParams.get('challenge')}
        onValueChange={(value) => {
          router.push(pathname + '?' + createQueryString('challenge', value));
        }}
      >
        <TabsList>
          {challenges.map((challenge) => (
            <TabsTrigger
              value={challenge.challengeId}
              key={challenge.challenge.id}
            >
              {challenge.challenge.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent
          value={searchParams.get('challenge')}
          className="max-h-60 overflow-auto noscrollbar"
        >
          <div className="px-2">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl capitalize font-bold">
                  {seletedChallenge?.name}
                </h2>
                <p className="text-muted-foreground text-xs max-w-40">
                  By {seletedChallenge?.challengeCreatedBy.name}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-6"
                onClick={() => router.push(`/join/${seletedChallenge?.id}`)}
              >
                <Share />
              </Button>
            </div>
            <Markdown source={seletedChallenge?.plan!} className="mt-2" />
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

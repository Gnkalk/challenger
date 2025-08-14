'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GetChallengePromise, GetChallengesPromise } from '@/server/queries';
import { use, useCallback, useEffect } from 'react';
import { Button } from './ui/button';
import { Share } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Markdown } from './md-editor';
import Link from 'next/link';
import { dateLib } from '@/lib/utils';
import { enUS } from 'react-day-picker/locale';

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
    if (!searchParams.get('challenge') && challenges.length > 0) {
      router.push(
        pathname +
          '?' +
          createQueryString('challenge', challenges[0].challenge.id)
      );
    }
  }, []);

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-xl font-bold text-foreground">Your Challenges</h3>
          {challenges.length === 0 && (
            <p className="text-sm text-muted-foreground">No challenges yet</p>
          )}
        </div>

        <Tabs
          value={searchParams.get('challenge')}
          onValueChange={(value) => {
            router.push(pathname + '?' + createQueryString('challenge', value));
          }}
        >
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 h-auto p-1 bg-muted/50">
            {challenges.map((challenge) => (
              <TabsTrigger
                value={challenge.challengeId}
                key={challenge.challenge.id}
                className="text-sm font-medium py-2 px-3 rounded-md transition-smooth data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                {challenge.challenge.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent
            value={searchParams.get('challenge')}
            className="mt-6 max-h-[500px] overflow-auto noscrollbar"
          >
            <div className="space-y-6">
              {seletedChallenge ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                        {seletedChallenge.name}
                      </h2>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <span>By</span>
                          <span className="font-medium text-foreground">
                            {seletedChallenge.challengeCreatedBy.name}
                          </span>
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="flex items-center gap-1.5">
                          <span>Day</span>
                          <span className="font-medium text-foreground">
                            {dateLib(enUS).differenceInCalendarDays(
                              new Date(),
                              seletedChallenge.createdAt ?? new Date()
                            ) + 1}
                          </span>
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="flex items-center gap-1.5">
                          <span className="font-medium text-foreground">
                            {seletedChallenge.challengeParticipants.length}
                          </span>
                          <span>participants</span>
                        </span>
                      </div>
                    </div>
                    <Link href={`/join/${seletedChallenge.id}`} target="_blank">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 transition-smooth hover:bg-accent"
                      >
                        <Share className="w-4 h-4" />
                        Share
                      </Button>
                    </Link>
                  </div>
                  <div>
                    <Markdown source={seletedChallenge.plan!} />
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg">Select a challenge to view details</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

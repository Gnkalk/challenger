import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getChallenge } from '@/server/queries';
import { Markdown } from '@/components/md-editor';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import { auth } from '@/server/auth';
import Link from 'next/link';
import { ActionButton } from '@/components/ui/action-button';
import { joinChallengeAction } from '@/server/actions';

export default async function Join({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const challenge = await getChallenge(id);
  if (!challenge) return notFound();

  const session = await auth();

  return (
    <Card className="max-w-md mx-auto mt-20 mb-4">
      <CardHeader>
        <CardTitle className="text-3xl">{challenge.name}</CardTitle>
        <div className="flex items-center gap-2 text-sm">
          <p>By {challenge.challengeCreatedBy.name}</p>
          <Avatar className="size-4">
            <AvatarImage src={challenge.challengeCreatedBy.image!} />
            <AvatarFallback className="size-4">
              {challenge.challengeCreatedBy.name ?? 'P'}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardDescription>{challenge.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Markdown source={challenge.plan} />
        <Separator className="my-4" />
        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
          {challenge.challengeParticipants.map((participant) => (
            <Avatar key={participant.participant.id}>
              <AvatarImage src={participant.participant.image!} />
              <AvatarFallback>{participant.participant.name}</AvatarFallback>
            </Avatar>
          ))}
        </div>
        {session ? (
          <ActionButton
            className="w-full"
            action={joinChallengeAction.bind(null, challenge.id)}
          >
            Join challenge
          </ActionButton>
        ) : (
          <Link href="/login">
            <Button className="w-full">Login to join</Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

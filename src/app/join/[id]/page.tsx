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

export default async function Join({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const challenge = await getChallenge(id);
  if (!challenge) return <div>Not found</div>;

  return (
    <Card className="max-w-md mx-auto mt-20">
      <CardHeader>
        <CardTitle className="text-3xl">{challenge.name}</CardTitle>
        <CardDescription>{challenge.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <p>By {challenge.challengeCreatedBy.name}</p>
          <Avatar>
            <AvatarImage src={challenge.challengeCreatedBy.image!} />
            <AvatarFallback>
              {challenge.challengeCreatedBy.name ?? 'P'}
            </AvatarFallback>
          </Avatar>
        </div>
        <Markdown source={challenge.plan} />
      </CardContent>
    </Card>
  );
}

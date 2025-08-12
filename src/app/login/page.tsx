import { Leaf } from 'lucide-react';
import { LoginForm } from '@/components/login-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await auth();
  if (session) return redirect('/dashboard');

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a
          href="#"
          className="flex items-center gap-2 self-center font-bold text-2xl"
        >
          Challenger
          <Leaf className="size-8 " />
        </a>
        <Card className="shadow-lg py-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Welcome to Challenger
            </CardTitle>
            <CardDescription className="text-base">
              Join or create daily challenges to build better habits and achieve
              your goals with a supportive community.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
        <div className="text-center text-sm text-muted-foreground">
          <p>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

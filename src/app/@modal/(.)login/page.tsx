import { LoginForm } from '@/components/login-form';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import React from 'react';

export default function Login() {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Login</DialogTitle>
        <DialogDescription>
          Login with your Github or Google account
        </DialogDescription>
      </DialogHeader>
      <LoginForm />
    </>
  );
}

'use client';

import { Loader2Icon } from 'lucide-react';

export default function loading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2Icon className="animate-spin size-12" />
    </div>
  );
}

'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

export default function layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();

  return (
    <Dialog
      defaultOpen
      onOpenChange={(open) => {
        if (open) return;

        setTimeout(() => {
          router.back();
        }, 100);
      }}
    >
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}

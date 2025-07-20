import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Dialog open={true}>
      <DialogContent showCloseButton={false}>{children}</DialogContent>
    </Dialog>
  );
}

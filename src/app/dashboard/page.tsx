import CalendarEvent from '@/components/calendar-event';
import ProfileCard from '@/components/profile-card';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function Dashboard() {
  return (
    <div className="flex items-center justify-center gap-6 w-full h-svh">
      <div className="grid gap-2 md:grid-cols-3">
        <div className="space-y-2">
          <ProfileCard />
          <CalendarEvent />
        </div>
        <div className="flex flex-col gap-2 col-span-2">
          <Card className="flex-1 py-2">
            <CardContent className="px-2">
              <Tabs defaultValue="account">
                <TabsList>
                  <TabsTrigger value="account">ط</TabsTrigger>
                  <TabsTrigger value="password">ب</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
          <Card className="flex-1"></Card>
        </div>
      </div>
    </div>
  );
}

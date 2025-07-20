import CalendarEvent from '@/components/calendar-event';
import ProfileCard from '@/components/profile-card';

export default async function Dashboard() {
  return (
    <div className="flex items-center justify-center gap-6 w-full h-svh">
      <div className="grid gap-2 grid-cols-3 grid-flow-row">
        <div className="space-y-2">
          <ProfileCard />
          <CalendarEvent />
        </div>
      </div>
    </div>
  );
}

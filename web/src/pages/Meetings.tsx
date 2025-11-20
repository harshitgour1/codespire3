import { MeetingList } from "@/components/meeting/MeetingList";

export default function Meetings() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
      <MeetingList />
    </div>
  );
}

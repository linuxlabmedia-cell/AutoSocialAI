"use client";

import { useParams } from "next/navigation";
import { ContentCalendar } from "@/components/calendar/ContentCalendar";

export default function ClientCalendarPage() {
  const { clientId } = useParams<{ clientId: string }>();
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Content Calendar</h2>
        <p className="text-muted-foreground text-sm mt-1">
          View and manage scheduled posts
        </p>
      </div>
      <ContentCalendar clientId={clientId} />
    </div>
  );
}

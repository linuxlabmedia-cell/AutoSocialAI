"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isToday } from "date-fns";
import { api } from "@/lib/trpc-provider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, getStatusColor } from "@/lib/utils";

export function ContentCalendar({ clientId }: { clientId: string }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);

  const { data: slots } = api.clients.getCalendar.useQuery({
    clientId,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  });

  const days = eachDayOfInterval({ start, end });
  const startPad = getDay(start);

  const slotsByDate = (slots ?? []).reduce(
    (acc, slot) => {
      const key = new Date(slot.scheduledDate).toDateString();
      if (!acc[key]) acc[key] = [];
      acc[key].push(slot);
      return acc;
    },
    {} as Record<string, typeof slots>
  );

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold">{format(currentDate, "MMMM yyyy")}</h2>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-xs border rounded-lg hover:bg-muted transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 border-b">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 divide-x divide-y">
        {Array.from({ length: startPad }).map((_, i) => (
          <div key={`pad-${i}`} className="h-28 bg-muted/20" />
        ))}

        {days.map((day) => {
          const key = day.toDateString();
          const daySlots = slotsByDate[key] ?? [];
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={key}
              className={cn(
                "h-28 p-1.5 space-y-1 overflow-hidden",
                !isCurrentMonth && "bg-muted/20",
                isCurrentDay && "bg-primary/5"
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full",
                  isCurrentDay ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                )}
              >
                {format(day, "d")}
              </span>

              {daySlots?.slice(0, 3).map((slot) => (
                <div
                  key={slot.id}
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded truncate",
                    slot.post
                      ? getStatusColor(slot.post.status)
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {slot.scheduledTime.slice(0, 5)}{" "}
                  {slot.post?.postType?.replace(/_/g, " ").slice(0, 12) ?? "Empty"}
                </div>
              ))}

              {(daySlots?.length ?? 0) > 3 && (
                <div className="text-xs text-muted-foreground pl-1">
                  +{daySlots.length - 3} more
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 p-3 border-t text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Published</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Scheduled</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pending</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-muted-foreground" /> Empty</span>
      </div>
    </div>
  );
}

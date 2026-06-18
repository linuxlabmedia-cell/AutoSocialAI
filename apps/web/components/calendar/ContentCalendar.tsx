"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isToday } from "date-fns";
import { api } from "@/lib/trpc-provider";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
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
    <div className="rounded-2xl border border-[#151f35] bg-[#0d1526] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#151f35]">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-violet-400" />
          <h2 className="font-semibold text-white text-sm">{format(currentDate, "MMMM yyyy")}</h2>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-xs border border-[#1a2540] text-slate-300 rounded-lg hover:bg-white/[0.04] transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 border-b border-[#151f35]">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-2 text-center text-xs font-medium text-slate-500">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-[#0f1a2e]">
        {Array.from({ length: startPad }).map((_, i) => (
          <div key={`pad-${i}`} className="h-28 bg-white/[0.015]" />
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
                !isCurrentMonth && "bg-white/[0.015]",
                isCurrentDay && "bg-violet-500/[0.06]"
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full",
                  isCurrentDay ? "bg-violet-600 text-white" : "text-slate-500"
                )}
              >
                {format(day, "d")}
              </span>

              {daySlots?.slice(0, 3).map((slot) => (
                <div
                  key={slot.id}
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded-md truncate",
                    slot.post
                      ? getStatusColor(slot.post.status)
                      : "bg-white/[0.04] text-slate-500"
                  )}
                >
                  {slot.scheduledTime.slice(0, 5)}{" "}
                  {slot.post?.postType?.replace(/_/g, " ").slice(0, 12) ?? "Empty"}
                </div>
              ))}

              {(daySlots?.length ?? 0) > 3 && (
                <div className="text-xs text-slate-600 pl-1">
                  +{daySlots.length - 3} more
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 p-3 border-t border-[#151f35] text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Published</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-violet-500" /> Scheduled</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pending</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-600" /> Empty</span>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Facebook, Instagram, Zap, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/trpc-provider";
import { toast } from "sonner";
import type { Client } from "@autosocial/db";

const tabs = [
  { label: "Overview", href: "" },
  { label: "Calendar", href: "/calendar" },
  { label: "Content", href: "/content" },
  { label: "Analytics", href: "/analytics" },
  { label: "Assets", href: "/assets" },
  { label: "Templates", href: "/templates" },
  { label: "Social Accounts", href: "/social" },
  { label: "Settings", href: "/settings" },
];

export function ClientHeader({ client }: { client: Client & { socialAccounts: any[] } }) {
  const { clientId } = useParams<{ clientId: string }>();
  const pathname = usePathname();
  const base = `/clients/${clientId}`;

  const generateBatch = api.workflows.trigger.useMutation({
    onSuccess: () => toast.success("Generating 30 days of content in the background…"),
    onError: (err) => toast.error(err.message),
  });

  const fbConnected = client.socialAccounts.some((a) => a.platform === "FACEBOOK" && a.isConnected);
  const igConnected = client.socialAccounts.some((a) => a.platform === "INSTAGRAM" && a.isConnected);

  const initials = client.businessName[0]?.toUpperCase() ?? "?";
  const brandColor = (client.brandColors as string[])?.[0];

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {client.logoUrl ? (
            <img
              src={client.logoUrl}
              alt={client.businessName}
              className="w-14 h-14 rounded-2xl object-contain bg-white/5 border border-[#1a2540] shrink-0"
            />
          ) : (
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0"
              style={{ background: brandColor ?? "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
            >
              {initials}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-white">{client.businessName}</h1>
            <p className="text-slate-500 text-sm">
              {client.industry}{client.location ? ` · ${client.location}` : ""}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              {fbConnected && (
                <span className="flex items-center gap-1 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                  <Facebook className="w-3 h-3" /> Facebook
                </span>
              )}
              {igConnected && (
                <span className="flex items-center gap-1 text-xs bg-pink-500/10 text-pink-400 border border-pink-500/20 px-2 py-0.5 rounded-full">
                  <Instagram className="w-3 h-3" /> Instagram
                </span>
              )}
              {(client as any).autoApprove && (
                <span className="flex items-center gap-1 text-xs bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-full">
                  <Zap className="w-3 h-3" /> Auto-approve
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => generateBatch.mutate({ clientId, type: "BATCH_30", config: {} })}
            disabled={generateBatch.isPending}
            className="text-sm bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
          >
            {generateBatch.isPending ? "Queued…" : "Generate 30 Days"}
          </button>
          <Link
            href={`${base}/settings`}
            className="p-2 rounded-xl border border-[#1a2540] text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-colors"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-0 border-b border-[#151f35]">
        {tabs.map((tab) => {
          const href = `${base}${tab.href}`;
          const isActive = tab.href === "" ? pathname === base : pathname.startsWith(href);
          return (
            <Link
              key={tab.href}
              href={href}
              className={cn(
                "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
                isActive
                  ? "border-violet-500 text-violet-300"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

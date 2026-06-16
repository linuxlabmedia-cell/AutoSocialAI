"use client";

import { api } from "@/lib/trpc-provider";
import { Instagram, Facebook, Twitter, Link2Off, RefreshCw, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

const PLATFORM_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  instagram: { label: "Instagram", icon: <Instagram className="w-4 h-4" />, color: "text-pink-400" },
  facebook: { label: "Facebook", icon: <Facebook className="w-4 h-4" />, color: "text-blue-400" },
  twitter: { label: "Twitter / X", icon: <Twitter className="w-4 h-4" />, color: "text-sky-400" },
  linkedin: { label: "LinkedIn", icon: <span className="text-xs font-bold">in</span>, color: "text-blue-300" },
  tiktok: { label: "TikTok", icon: <span className="text-xs font-bold">TT</span>, color: "text-white" },
  youtube: { label: "YouTube", icon: <span className="text-xs font-bold">YT</span>, color: "text-red-400" },
  pinterest: { label: "Pinterest", icon: <span className="text-xs font-bold">Pi</span>, color: "text-red-300" },
  gmb: { label: "Google Business", icon: <span className="text-xs font-bold">G</span>, color: "text-yellow-400" },
};

export function SocialAccountsManager({ clientId }: { clientId: string }) {
  const [connecting, setConnecting] = useState(false);

  const { data, refetch, isLoading } = api.social.getConnectedAccounts.useQuery({ clientId });
  const getConnectUrl = api.social.getConnectUrl.useMutation({
    onSuccess: (res) => {
      if (res.url) window.open(res.url, "_blank", "width=600,height=700");
    },
    onError: (err) => toast.error(err.message),
    onSettled: () => setConnecting(false),
  });
  const disconnectAll = api.social.disconnectAll.useMutation({
    onSuccess: () => { toast.success("All accounts disconnected"); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  const platforms = data?.platforms ?? [];
  const displayNames = data?.displayNames ?? {};

  function handleConnect() {
    setConnecting(true);
    getConnectUrl.mutate({ clientId });
  }

  return (
    <div className="space-y-5">

      {/* Connect card */}
      <div className="rounded-2xl border border-[#151f35] bg-[#0d1526] p-5 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Connect Social Accounts</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Click below to open the account connection portal. The client can connect Instagram, Facebook, TikTok, LinkedIn, and more.
          </p>
        </div>

        <button
          onClick={handleConnect}
          disabled={connecting || getConnectUrl.isPending}
          className={cn(
            "flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-semibold transition-colors",
            connecting || getConnectUrl.isPending
              ? "bg-violet-600/50 text-violet-300 cursor-wait"
              : "bg-violet-600 hover:bg-violet-500 text-white"
          )}
        >
          {connecting || getConnectUrl.isPending ? (
            <><RefreshCw className="w-4 h-4 animate-spin" /> Opening portal…</>
          ) : (
            <>
              <Link2Off className="w-4 h-4 rotate-45" />
              {platforms.length > 0 ? "Manage / Add Accounts" : "Connect Social Accounts"}
            </>
          )}
        </button>

        <p className="text-xs text-slate-600 text-center">
          After connecting, click &ldquo;Refresh&rdquo; below to see the updated accounts.
        </p>
      </div>

      {/* Connected platforms */}
      <div className="rounded-2xl border border-[#151f35] bg-[#0d1526] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Connected Accounts</h3>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>

        {isLoading ? (
          <p className="text-xs text-slate-600 py-3 text-center">Loading…</p>
        ) : platforms.length === 0 ? (
          <p className="text-xs text-slate-600 py-3 text-center">
            No accounts connected yet. Use the button above to connect.
          </p>
        ) : (
          <div className="space-y-2">
            {platforms.map((platform) => {
              const meta = PLATFORM_META[platform.toLowerCase()] ?? {
                label: platform,
                icon: <CheckCircle className="w-4 h-4" />,
                color: "text-slate-400",
              };
              const displayName = displayNames[platform] ?? platform;
              return (
                <div key={platform} className="flex items-center justify-between rounded-xl bg-[#06090f] border border-[#1a2540] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className={cn("w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center", meta.color)}>
                      {meta.icon}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">{meta.label}</p>
                      {displayName !== platform && (
                        <p className="text-xs text-slate-500">@{displayName}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-medium">Active</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {platforms.length > 0 && (
          <button
            onClick={() => {
              if (confirm("This will disconnect all social accounts for this client. Continue?")) {
                disconnectAll.mutate({ clientId });
              }
            }}
            disabled={disconnectAll.isPending}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors disabled:opacity-50 mt-1"
          >
            <Link2Off className="w-3 h-3" />
            {disconnectAll.isPending ? "Disconnecting…" : "Disconnect All Accounts"}
          </button>
        )}
      </div>
    </div>
  );
}

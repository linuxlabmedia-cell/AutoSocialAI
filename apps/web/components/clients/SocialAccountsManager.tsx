"use client";

import { api } from "@/lib/trpc-provider";
import { Facebook, Instagram, Link2Off, RefreshCw, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SocialAccountsManager({ clientId }: { clientId: string }) {
  const { data: authUrl } = api.meta.getAuthUrl.useQuery({ clientId });
  const { data: accounts, refetch } = api.meta.getConnectedAccounts.useQuery({ clientId });
  const disconnect = api.meta.disconnectAccount.useMutation({
    onSuccess: () => { toast.success("Account disconnected"); refetch(); },
    onError: (err) => toast.error(err.message),
  });
  const testConnection = api.meta.testConnection.useMutation({
    onSuccess: (result) => {
      if (result.success) toast.success("Connection is active!");
      else toast.error(`Connection issue: ${result.error}`);
    },
  });

  const connected = accounts?.filter((a) => a.isConnected) ?? [];

  return (
    <div className="space-y-5">

      {/* Connect */}
      <div className="rounded-2xl border border-[#151f35] bg-[#0d1526] p-5 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Connect Facebook & Instagram</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Connects all Facebook Pages and linked Instagram Business accounts in one click. Posts will be published through the client's pages.
          </p>
        </div>

        <a
          href={authUrl?.url}
          className={cn(
            "flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-semibold transition-colors",
            authUrl?.url
              ? "bg-blue-600 hover:bg-blue-500 text-white"
              : "bg-[#06090f] text-slate-600 cursor-not-allowed border border-[#1a2540]"
          )}
          onClick={(e) => { if (!authUrl?.url) e.preventDefault(); }}
        >
          <Facebook className="w-4 h-4" />
          {connected.length > 0 ? "Connect More Accounts" : "Connect Facebook & Instagram"}
        </a>

        <a
          href={`https://developers.facebook.com/apps/5382979845261473/fb-login/settings/`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Meta App Settings (for redirect URI setup)
        </a>
      </div>

      {/* Connected accounts */}
      {accounts && accounts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-semibold text-white">Connected Accounts</h3>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>
          {accounts.map((account) => {
            const isFacebook = account.platform === "FACEBOOK";
            const isExpiringSoon =
              account.accessTokenExpiresAt &&
              new Date(account.accessTokenExpiresAt) < new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

            return (
              <div key={account.id} className="rounded-2xl border border-[#151f35] bg-[#0d1526] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center",
                      isFacebook ? "bg-blue-500/10 border border-blue-500/20" : "bg-pink-500/10 border border-pink-500/20"
                    )}>
                      {isFacebook
                        ? <Facebook className="w-4 h-4 text-blue-400" />
                        : <Instagram className="w-4 h-4 text-pink-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{account.accountName}</p>
                      <p className="text-xs text-slate-500 capitalize">
                        {account.platform.toLowerCase()} · {account.accountType ?? "account"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {account.isConnected
                      ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                      : <AlertCircle className="w-4 h-4 text-red-400" />}
                    <span className={cn("text-xs font-medium", account.isConnected ? "text-emerald-400" : "text-red-400")}>
                      {account.isConnected ? "Active" : "Disconnected"}
                    </span>
                  </div>
                </div>

                {isExpiringSoon && (
                  <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
                    Token expires soon — reconnect to avoid publishing interruptions
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => testConnection.mutate({ socialAccountId: account.id })}
                    disabled={testConnection.isPending}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-[#1a2540] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] rounded-xl transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={cn("w-3 h-3", testConnection.isPending && "animate-spin")} />
                    Test Connection
                  </button>
                  <button
                    onClick={() => disconnect.mutate({ socialAccountId: account.id })}
                    disabled={disconnect.isPending}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <Link2Off className="w-3 h-3" />
                    Disconnect
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {connected.length === 0 && accounts !== undefined && (
        <p className="text-center text-xs text-slate-600 py-2">
          No accounts connected yet. Use the button above to connect.
        </p>
      )}
    </div>
  );
}

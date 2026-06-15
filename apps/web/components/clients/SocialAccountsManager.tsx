"use client";

import { api } from "@/lib/trpc-provider";
import { Facebook, Instagram, Link2, Link2Off, RefreshCw, CheckCircle, AlertCircle, ExternalLink, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

const CALLBACK_URL = "http://localhost:3000/api/meta/callback";

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="p-1 rounded hover:bg-white/10 transition-colors"
      title="Copy"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
    </button>
  );
}

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

      {/* Step 1 — Meta App Setup */}
      <div className="rounded-2xl border border-[#151f35] bg-[#0d1526] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-400">1</div>
          <h3 className="text-sm font-semibold text-white">Register the callback URL in Meta</h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Before connecting, add the URL below to your Meta App's <span className="text-slate-300">Valid OAuth Redirect URIs</span>. You only do this once.
        </p>
        <div className="flex items-center gap-2 bg-[#06090f] border border-[#1a2540] rounded-xl px-3 py-2.5">
          <code className="flex-1 text-xs text-violet-300 font-mono">{CALLBACK_URL}</code>
          <CopyButton value={CALLBACK_URL} />
        </div>
        <a
          href={`https://developers.facebook.com/apps/1672074470547406/fb-login/settings/`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open Meta App → Facebook Login → Settings
        </a>
        <div className="text-xs text-slate-600 space-y-1 pl-1">
          <p>1. Click the link above → scroll to <span className="text-slate-400">Valid OAuth Redirect URIs</span></p>
          <p>2. Paste the URL → click Add → Save Changes</p>
          <p>3. Make sure your Facebook account is listed as a <span className="text-slate-400">Developer/Tester</span> in Roles</p>
        </div>
      </div>

      {/* Step 2 — Connect */}
      <div className="rounded-2xl border border-[#151f35] bg-[#0d1526] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-400">2</div>
          <h3 className="text-sm font-semibold text-white">Connect Facebook & Instagram</h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          This connects all Facebook Pages and linked Instagram Business accounts in one click. The client's posts will be published through their pages.
        </p>
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
      </div>

      {/* Connected accounts */}
      {accounts && accounts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white px-1">Connected Accounts</h3>
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
                        : <Instagram className="w-4 h-4 text-pink-400" />
                      }
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
                      : <AlertCircle className="w-4 h-4 text-red-400" />
                    }
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
          No accounts connected yet. Complete steps 1 & 2 above to enable auto-publishing.
        </p>
      )}
    </div>
  );
}

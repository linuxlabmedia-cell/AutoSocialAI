"use client";

import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Manage your account and workspace settings
        </p>
      </div>
      <div className="rounded-2xl border border-[#151f35] bg-[#0d1526] p-6 max-w-lg">
        <div className="flex items-center gap-2 mb-2">
          <SettingsIcon className="w-4 h-4 text-violet-400" />
          <h2 className="text-lg font-semibold text-white">Account</h2>
        </div>
        <p className="text-sm text-slate-500">
          Profile and workspace settings coming soon.
        </p>
      </div>
    </div>
  );
}

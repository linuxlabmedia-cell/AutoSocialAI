"use client";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and workspace settings
        </p>
      </div>
      <div className="bg-card rounded-lg border p-6 max-w-lg">
        <h2 className="text-lg font-semibold mb-2">Account</h2>
        <p className="text-sm text-muted-foreground">
          Profile and workspace settings coming soon.
        </p>
      </div>
    </div>
  );
}

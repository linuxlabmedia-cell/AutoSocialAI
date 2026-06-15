"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { toast } from "sonner";
import { SocialAccountsManager } from "@/components/clients/SocialAccountsManager";

function MetaCallbackHandler() {
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("meta_connected") === "true") {
      toast.success("Facebook & Instagram connected successfully!");
    }
    if (searchParams.get("meta_error")) {
      toast.error(`Connection failed: ${searchParams.get("meta_error")}`);
    }
  }, [searchParams]);
  return null;
}

export default function ClientSocialPage() {
  const { clientId } = useParams<{ clientId: string }>();

  return (
    <div className="space-y-6 max-w-2xl">
      <Suspense>
        <MetaCallbackHandler />
      </Suspense>
      <div>
        <h2 className="text-2xl font-bold text-white">Social Accounts</h2>
        <p className="text-slate-500 text-sm mt-1">
          Connect Facebook Pages and Instagram Business accounts for automatic publishing
        </p>
      </div>
      <SocialAccountsManager clientId={clientId} />
    </div>
  );
}

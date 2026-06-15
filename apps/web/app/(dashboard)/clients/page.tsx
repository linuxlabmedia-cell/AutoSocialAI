import Link from "next/link";
import { Plus } from "lucide-react";
import { ClientList } from "@/components/clients/ClientList";

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-muted-foreground mt-1">
            Manage your client accounts and brand profiles
          </p>
        </div>
        <Link
          href="/clients/new"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Client
        </Link>
      </div>

      <ClientList />
    </div>
  );
}

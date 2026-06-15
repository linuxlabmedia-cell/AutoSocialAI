import { ClientProfileForm } from "@/components/clients/ClientProfileForm";

export default function NewClientPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add New Client</h1>
        <p className="text-muted-foreground mt-1">
          Set up a brand profile so the AI can generate on-brand content automatically.
        </p>
      </div>
      <ClientProfileForm />
    </div>
  );
}

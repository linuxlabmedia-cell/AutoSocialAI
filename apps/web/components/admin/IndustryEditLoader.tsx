"use client";

import { api } from "@/lib/trpc-provider";
import { IndustryForm } from "./IndustryForm";
import { Loader2 } from "lucide-react";

export function IndustryEditLoader({ industryId }: { industryId: string }) {
  const { data, isLoading } = api.industries.get.useQuery({ id: industryId });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
      </div>
    );
  }

  if (!data) return <p className="text-slate-500">Industry not found.</p>;

  return (
    <IndustryForm
      industryId={data.id}
      initialData={{
        name: data.name,
        slug: data.slug,
        description: data.description,
        keywords: data.keywords,
        tone: data.tone,
        visualStyle: data.visualStyle,
        suggestedCtaTypes: data.suggestedCtaTypes,
        compatibleCategories: data.compatibleCategories,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
      }}
    />
  );
}

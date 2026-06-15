"use client";

import { api } from "@/lib/trpc-provider";
import { TemplateForm } from "./TemplateForm";
import { Loader2 } from "lucide-react";

export function TemplateEditLoader({ templateId }: { templateId: string }) {
  const { data, isLoading } = api.templates.get.useQuery({ templateId });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-slate-500">Template not found.</p>;
  }

  return (
    <TemplateForm
      templateId={data.id}
      initialData={{
        name: data.name,
        category: data.category,
        industries: data.industries,
        layoutType: data.layoutType ?? "",
        description: data.description ?? "",
        exampleImageUrl: data.exampleImageUrl ?? "",
        promptInstructions: data.promptInstructions ?? "",
        designRules: data.designRules ?? "",
        textPlacementRules: data.textPlacementRules ?? "",
        brandPlacementRules: data.brandPlacementRules ?? "",
        ctaPlacementRules: data.ctaPlacementRules ?? "",
        promptFramework: data.promptFramework ?? "",
        contentStrategy: data.contentStrategy ?? "",
        marketingObjective: data.marketingObjective ?? "",
        emotionalObjective: data.emotionalObjective ?? "",
        isActive: data.isActive,
        sortOrder: data.sortOrder,
      }}
    />
  );
}

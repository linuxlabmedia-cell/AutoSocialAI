"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/trpc-provider";
import { Save, Loader2, Plus, X } from "lucide-react";

const ALL_SERVICE_CATEGORY_SLUGS = [
  "website-design",
  "website-management",
  "content-management",
  "meta-ads",
  "seo",
  "social-media",
  "lead-generation",
  "branding",
];

const SERVICE_CATEGORY_LABELS: Record<string, string> = {
  "website-design": "Website Design & Development",
  "website-management": "Website Management",
  "content-management": "Content Management",
  "meta-ads": "Meta Ads Management",
  "seo": "SEO",
  "social-media": "Social Media Management",
  "lead-generation": "Lead Generation",
  "branding": "Branding",
};

interface IndustryFormProps {
  industryId?: string;
  initialData?: {
    name: string;
    slug: string;
    description: string;
    keywords: string[];
    tone: string;
    visualStyle: string;
    suggestedCtaTypes: string[];
    compatibleCategories: string[];
    isActive: boolean;
    sortOrder: number;
  };
}

function TagInput({
  label,
  values,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  hint?: string;
}) {
  const [input, setInput] = useState("");

  function add() {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
      setInput("");
    }
  }

  function remove(val: string) {
    onChange(values.filter((v) => v !== val));
  }

  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      {hint && <p className="text-xs text-slate-600 mb-2">{hint}</p>}
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs"
          >
            {v}
            <button type="button" onClick={() => remove(v)} className="hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 bg-[#06090f] border border-[#151f35] rounded-lg text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-violet-500/50"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-2 bg-violet-600/20 border border-violet-500/30 text-violet-300 rounded-lg hover:bg-violet-600/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function IndustryForm({ industryId, initialData }: IndustryFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [keywords, setKeywords] = useState<string[]>(initialData?.keywords ?? []);
  const [tone, setTone] = useState(initialData?.tone ?? "");
  const [visualStyle, setVisualStyle] = useState(initialData?.visualStyle ?? "");
  const [suggestedCtaTypes, setSuggestedCtaTypes] = useState<string[]>(initialData?.suggestedCtaTypes ?? []);
  const [compatibleCategories, setCompatibleCategories] = useState<string[]>(
    initialData?.compatibleCategories ?? ALL_SERVICE_CATEGORY_SLUGS
  );
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder ?? 0);

  const createMutation = api.industries.create.useMutation({
    onSuccess: () => router.push("/admin/industries"),
  });
  const updateMutation = api.industries.update.useMutation({
    onSuccess: () => router.push("/admin/industries"),
  });

  const saving = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error?.message ?? updateMutation.error?.message;

  function autoSlug(val: string) {
    setName(val);
    if (!industryId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { name, slug, description, keywords, tone, visualStyle, suggestedCtaTypes, compatibleCategories, isActive, sortOrder };
    if (industryId) {
      updateMutation.mutate({ id: industryId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  function toggleCategory(slug: string) {
    setCompatibleCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="p-3 rounded-lg bg-rose-600/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-[#151f35] overflow-hidden">
        <div className="px-5 py-4 bg-[#0a0f1c]">
          <h3 className="text-sm font-semibold text-white">Basic Information</h3>
        </div>
        <div className="p-5 space-y-4 bg-[#0d1424]">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Industry Name *</label>
            <input
              value={name}
              onChange={(e) => autoSlug(e.target.value)}
              placeholder="e.g. Real Estate"
              required
              className="w-full px-3 py-2.5 bg-[#06090f] border border-[#151f35] rounded-lg text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-violet-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Slug *</label>
            <p className="text-xs text-slate-600 mb-1.5">Lowercase, hyphens only — auto-generated from name</p>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. real-estate"
              required
              pattern="^[a-z0-9-]+$"
              className="w-full px-3 py-2.5 bg-[#06090f] border border-[#151f35] rounded-lg text-sm text-white font-mono placeholder:text-slate-700 focus:outline-none focus:border-violet-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this industry..."
              rows={2}
              required
              className="w-full px-3 py-2.5 bg-[#06090f] border border-[#151f35] rounded-lg text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-violet-500/50 resize-y"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Sort Order</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-[#06090f] border border-[#151f35] rounded-lg text-sm text-white focus:outline-none focus:border-violet-500/50"
              />
            </div>
            <div className="flex items-center gap-3 mt-4">
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isActive ? "bg-violet-600" : "bg-slate-700"}`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isActive ? "translate-x-4" : "translate-x-1"}`} />
              </button>
              <span className="text-sm text-slate-400">{isActive ? "Active" : "Inactive"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#151f35] overflow-hidden">
        <div className="px-5 py-4 bg-[#0a0f1c]">
          <h3 className="text-sm font-semibold text-white">Brand & Content Profile</h3>
        </div>
        <div className="p-5 space-y-4 bg-[#0d1424]">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Industry Tone *</label>
            <input
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              placeholder="e.g. Professional, aspirational, trustworthy, market-savvy"
              required
              className="w-full px-3 py-2.5 bg-[#06090f] border border-[#151f35] rounded-lg text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-violet-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Visual Style *</label>
            <input
              value={visualStyle}
              onChange={(e) => setVisualStyle(e.target.value)}
              placeholder="e.g. Clean white spaces, aerial property photography, modern typography"
              required
              className="w-full px-3 py-2.5 bg-[#06090f] border border-[#151f35] rounded-lg text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-violet-500/50"
            />
          </div>
          <TagInput
            label="Industry Keywords"
            values={keywords}
            onChange={setKeywords}
            placeholder="Add keyword and press Enter..."
            hint="Keywords used to contextualize AI content generation for this industry"
          />
          <TagInput
            label="Suggested CTA Types"
            values={suggestedCtaTypes}
            onChange={setSuggestedCtaTypes}
            placeholder="Add CTA and press Enter..."
            hint='e.g. "Get a Free Quote", "Book a Consultation"'
          />
        </div>
      </div>

      <div className="rounded-xl border border-[#151f35] overflow-hidden">
        <div className="px-5 py-4 bg-[#0a0f1c]">
          <h3 className="text-sm font-semibold text-white">Compatible Service Categories</h3>
        </div>
        <div className="p-5 bg-[#0d1424]">
          <p className="text-xs text-slate-600 mb-3">Which LinuxLab Media services are relevant for this industry?</p>
          <div className="flex flex-wrap gap-2">
            {ALL_SERVICE_CATEGORY_SLUGS.map((catSlug) => (
              <button
                key={catSlug}
                type="button"
                onClick={() => toggleCategory(catSlug)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  compatibleCategories.includes(catSlug)
                    ? "bg-violet-600/20 border-violet-500/40 text-violet-300"
                    : "bg-[#06090f] border-[#151f35] text-slate-500 hover:text-slate-300 hover:border-slate-600"
                }`}
              >
                {SERVICE_CATEGORY_LABELS[catSlug]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || !name || !slug}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : industryId ? "Update Industry" : "Create Industry"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/industries")}
          className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

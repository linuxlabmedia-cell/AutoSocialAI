"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/trpc-provider";
import {
  Save,
  Upload,
  X,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";

const TEMPLATE_CATEGORIES = [
  "Market Update",
  "Neighborhood Spotlight",
  "Property Management Tip",
  "Rental Market Insight",
  "Local Business Spotlight",
  "Industry Statistic",
  "FAQ Graphic",
  "Educational Post",
  "Seasonal Reminder",
  "Maintenance Tip",
  "Investment Insight",
  "Customer Testimonial",
  "Before & After",
  "Service Highlight",
  "Case Study",
  "Community Update",
  "Local Event Promotion",
  "Hiring Announcement",
  "Team Spotlight",
  "Monthly Report",
];

const LAYOUT_TYPES = [
  "Square (1:1)",
  "Vertical (4:5)",
  "Story (9:16)",
  "Landscape (16:9)",
  "Infographic",
  "Carousel Slide",
  "Split Layout",
  "Overlay Text",
  "Data Visualization",
];

const INDUSTRIES = [
  "Real Estate",
  "Property Management",
  "Mortgage",
  "Construction",
  "Interior Design",
  "Local Business",
  "Restaurant",
  "Retail",
  "Healthcare",
  "Legal",
  "Finance",
  "Technology",
  "Education",
  "Fitness & Wellness",
  "Beauty & Salon",
];

const MARKETING_OBJECTIVES = [
  "Trust Building",
  "Authority Building",
  "Lead Generation",
  "Education",
  "Brand Awareness",
  "Community Engagement",
  "Retention",
  "Reputation Building",
  "Product/Service Promotion",
  "Social Proof",
];

const EMOTIONAL_OBJECTIVES = [
  "Inspire",
  "Educate",
  "Reassure",
  "Excite",
  "Build Trust",
  "Create FOMO",
  "Motivate",
  "Entertain",
  "Empathize",
];

interface TemplateFormProps {
  templateId?: string;
  initialData?: {
    name: string;
    category: string;
    industries: string[];
    layoutType: string;
    description: string;
    exampleImageUrl: string;
    promptInstructions: string;
    designRules: string;
    textPlacementRules: string;
    brandPlacementRules: string;
    ctaPlacementRules: string;
    promptFramework: string;
    contentStrategy: string;
    marketingObjective: string;
    emotionalObjective: string;
    isActive: boolean;
    sortOrder: number;
  };
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[#151f35] rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-[#0a0f1c] hover:bg-[#0d1424] transition-colors"
      >
        <span className="font-semibold text-white text-sm">{title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500" />
        )}
      </button>
      {open && <div className="p-5 space-y-4 bg-[#0d1424]">{children}</div>}
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      {hint && <p className="text-xs text-slate-600 mb-2">{hint}</p>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2.5 bg-[#06090f] border border-[#151f35] rounded-lg text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-violet-500/50 resize-y"
      />
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 bg-[#06090f] border border-[#151f35] rounded-lg text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-violet-500/50"
      />
    </div>
  );
}

function MultiSelect({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
  };
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              selected.includes(opt)
                ? "bg-violet-600/20 border-violet-500/40 text-violet-300"
                : "bg-[#06090f] border-[#151f35] text-slate-500 hover:text-slate-300 hover:border-slate-600"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TemplateForm({ templateId, initialData }: TemplateFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const [name, setName] = useState(initialData?.name ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [industries, setIndustries] = useState<string[]>(initialData?.industries ?? []);
  const [layoutType, setLayoutType] = useState(initialData?.layoutType ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [exampleImageUrl, setExampleImageUrl] = useState(initialData?.exampleImageUrl ?? "");
  const [promptInstructions, setPromptInstructions] = useState(
    initialData?.promptInstructions ?? ""
  );
  const [designRules, setDesignRules] = useState(initialData?.designRules ?? "");
  const [textPlacementRules, setTextPlacementRules] = useState(
    initialData?.textPlacementRules ?? ""
  );
  const [brandPlacementRules, setBrandPlacementRules] = useState(
    initialData?.brandPlacementRules ?? ""
  );
  const [ctaPlacementRules, setCtaPlacementRules] = useState(initialData?.ctaPlacementRules ?? "");
  const [promptFramework, setPromptFramework] = useState(initialData?.promptFramework ?? "");
  const [contentStrategy, setContentStrategy] = useState(initialData?.contentStrategy ?? "");
  const [marketingObjective, setMarketingObjective] = useState(
    initialData?.marketingObjective ?? ""
  );
  const [emotionalObjective, setEmotionalObjective] = useState(
    initialData?.emotionalObjective ?? ""
  );
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  const createMutation = api.templates.create.useMutation({
    onSuccess: () => router.push("/templates"),
  });
  const updateMutation = api.templates.update.useMutation({
    onSuccess: () => router.push("/templates"),
  });

  const saving = createMutation.isPending || updateMutation.isPending;

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.url) setExampleImageUrl(data.url);
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name,
      category,
      industries,
      layoutType: layoutType || undefined,
      description: description || undefined,
      exampleImageUrl: exampleImageUrl || undefined,
      promptInstructions: promptInstructions || undefined,
      designRules: designRules || undefined,
      textPlacementRules: textPlacementRules || undefined,
      brandPlacementRules: brandPlacementRules || undefined,
      ctaPlacementRules: ctaPlacementRules || undefined,
      promptFramework: promptFramework || undefined,
      contentStrategy: contentStrategy || undefined,
      marketingObjective: marketingObjective || undefined,
      emotionalObjective: emotionalObjective || undefined,
      isActive,
    };
    if (templateId) {
      updateMutation.mutate({ templateId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      <Section title="Basic Information">
        <Input label="Template Name *" value={name} onChange={setName} placeholder="e.g. San Antonio Market Update" />

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#06090f] border border-[#151f35] rounded-lg text-sm text-white focus:outline-none focus:border-violet-500/50"
          >
            <option value="">Select a category...</option>
            {TEMPLATE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Layout Type</label>
          <select
            value={layoutType}
            onChange={(e) => setLayoutType(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#06090f] border border-[#151f35] rounded-lg text-sm text-white focus:outline-none focus:border-violet-500/50"
          >
            <option value="">Select layout...</option>
            {LAYOUT_TYPES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <TextArea
          label="Description"
          value={description}
          onChange={setDescription}
          placeholder="Describe what this template is for and when to use it..."
          rows={3}
        />

        <MultiSelect
          label="Industry Compatibility"
          options={INDUSTRIES}
          selected={industries}
          onChange={setIndustries}
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              isActive ? "bg-violet-600" : "bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                isActive ? "translate-x-4" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm text-slate-400">
            {isActive ? "Active — AI can use this template" : "Inactive — hidden from AI"}
          </span>
        </div>
      </Section>

      <Section title="Example Image">
        <div className="space-y-3">
          {exampleImageUrl ? (
            <div className="relative group w-full max-w-sm">
              <img
                src={exampleImageUrl}
                alt="Template example"
                className="w-full rounded-lg border border-[#151f35] object-cover max-h-64"
              />
              <button
                type="button"
                onClick={() => setExampleImageUrl("")}
                className="absolute top-2 right-2 bg-black/60 hover:bg-rose-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#151f35] hover:border-violet-500/40 rounded-xl p-10 text-center cursor-pointer transition-colors"
            >
              {uploading ? (
                <Loader2 className="w-8 h-8 text-slate-600 mx-auto animate-spin" />
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">Click to upload example image</p>
                  <p className="text-slate-700 text-xs mt-1">PNG, JPG up to 8MB</p>
                </>
              )}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Input
            label="Or paste image URL"
            value={exampleImageUrl}
            onChange={setExampleImageUrl}
            placeholder="https://..."
          />
        </div>
      </Section>

      <Section title="Content Strategy">
        <TextArea
          label="Content Strategy"
          value={contentStrategy}
          onChange={setContentStrategy}
          placeholder="Describe the overall content strategy for this template..."
          rows={3}
          hint="What is this template trying to achieve? Who is it for?"
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Marketing Objective
            </label>
            <select
              value={marketingObjective}
              onChange={(e) => setMarketingObjective(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#06090f] border border-[#151f35] rounded-lg text-sm text-white focus:outline-none focus:border-violet-500/50"
            >
              <option value="">Select objective...</option>
              {MARKETING_OBJECTIVES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Emotional Objective
            </label>
            <select
              value={emotionalObjective}
              onChange={(e) => setEmotionalObjective(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#06090f] border border-[#151f35] rounded-lg text-sm text-white focus:outline-none focus:border-violet-500/50"
            >
              <option value="">Select objective...</option>
              {EMOTIONAL_OBJECTIVES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Section>

      <Section title="AI Prompt Framework" defaultOpen={true}>
        <TextArea
          label="Prompt Framework *"
          value={promptFramework}
          onChange={setPromptFramework}
          placeholder={`Create a professional [industry] social media graphic.\n\nTitle: [HEADLINE]\nSubtitle: [SUPPORTING TEXT]\n\nLayout: Professional vertical social media design...\n\nInclude:\n- High quality imagery\n- Clean typography\n- Professional CTA section\n\nDesign should look like a premium marketing agency created it.`}
          rows={12}
          hint="This is the core image generation prompt. Use [HEADLINE], [SUPPORTING_TEXT], [CTA], [BRAND_COLORS], [BUSINESS_NAME], [LOCATION] as placeholders — the AI will fill these in."
        />
        <TextArea
          label="Prompt Instructions"
          value={promptInstructions}
          onChange={setPromptInstructions}
          placeholder="Additional instructions for the AI when using this template..."
          rows={4}
          hint="What tone, style, or specific elements should always be included?"
        />
      </Section>

      <Section title="Design Rules" defaultOpen={false}>
        <TextArea
          label="Design Rules"
          value={designRules}
          onChange={setDesignRules}
          placeholder="e.g. Always use a dark background. Minimum 2 columns. Keep imagery on the right side..."
          rows={4}
        />
        <TextArea
          label="Text Placement Rules"
          value={textPlacementRules}
          onChange={setTextPlacementRules}
          placeholder="e.g. Headline at top 25% of frame. Body text left-aligned. Max 3 lines of body copy..."
          rows={4}
        />
        <TextArea
          label="Brand Placement Rules"
          value={brandPlacementRules}
          onChange={setBrandPlacementRules}
          placeholder="e.g. Logo in bottom right corner. Brand colors as accent only, not dominant..."
          rows={3}
        />
        <TextArea
          label="CTA Placement Rules"
          value={ctaPlacementRules}
          onChange={setCtaPlacementRules}
          placeholder="e.g. CTA button in bottom 15% of frame. Use brand primary color for CTA background..."
          rows={3}
        />
      </Section>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || !name || !category}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : templateId ? "Update Template" : "Create Template"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/templates")}
          className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

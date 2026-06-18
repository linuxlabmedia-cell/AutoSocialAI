"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/trpc-provider";
import { toast } from "sonner";
import { Upload, Loader2, X, Building2, Mic2, Layers, Zap, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const BRAND_VOICES = ["Professional", "Casual", "Playful", "Authoritative", "Inspirational", "Educational"];
const INDUSTRIES = [
  "Food & Beverage", "Retail", "Healthcare", "Technology", "Finance",
  "Real Estate", "Education", "Fitness & Wellness", "Beauty & Fashion",
  "Legal", "Automotive", "Travel & Hospitality", "Other",
];
const CONTENT_PILLARS_OPTIONS = [
  "Educational Tips", "Behind the Scenes", "Customer Stories", "Product Spotlights",
  "Industry News", "Team Highlights", "FAQs", "Before & After", "Promotions",
];
const POSTING_FREQUENCIES = [
  { value: "DAILY", label: "Daily (7x/week)" },
  { value: "THREE_PER_WEEK", label: "3x per week" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "CUSTOM", label: "Custom schedule" },
];

const schema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  website: z.string().optional(),
  location: z.string().optional(),
  timezone: z.string().default("America/New_York"),
  targetAudience: z.string().optional(),
  brandVoice: z.string().optional(),
  brandVoiceNotes: z.string().optional(),
  contentPillars: z.array(z.string()).default([]),
  postingFrequency: z.enum(["DAILY", "THREE_PER_WEEK", "WEEKLY", "CUSTOM"]).default("DAILY"),
  postingTimes: z.array(z.string()).default(["09:00"]),
  ctaPreferences: z.string().optional(),
  specialOffers: z.string().optional(),
  autoApprove: z.boolean().default(false),
  logoUrl: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const STEPS = [
  { label: "Basic Info", icon: Building2 },
  { label: "Brand Voice", icon: Mic2 },
  { label: "Content Strategy", icon: Layers },
  { label: "Automation", icon: Zap },
];

const inputClass =
  "mt-1 w-full border border-[#1a2540] rounded-xl px-3 py-2.5 text-sm bg-[#06090f] text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-violet-500/50 transition-colors";

export function ClientProfileForm({ existingClientId }: { existingClientId?: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const isEdit = Boolean(existingClientId);

  const { data: existing } = api.clients.get.useQuery(
    { clientId: existingClientId! },
    { enabled: isEdit }
  );

  const createClient = api.clients.create.useMutation({
    onSuccess: (client) => {
      toast.success("Client created! Connect their social accounts next.");
      router.push(`/clients/${client.id}/social`);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateClient = api.clients.update.useMutation({
    onSuccess: () => toast.success("Client updated!"),
    onError: (err) => toast.error(err.message),
  });

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { contentPillars: [], postingFrequency: "DAILY", autoApprove: false },
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (existing) {
      reset({
        businessName: existing.businessName,
        industry: existing.industry,
        website: existing.website ?? "",
        location: existing.location ?? "",
        timezone: existing.timezone,
        targetAudience: existing.targetAudience ?? "",
        brandVoice: existing.brandVoice ?? "",
        brandVoiceNotes: existing.brandVoiceNotes ?? "",
        contentPillars: existing.contentPillars,
        postingFrequency: existing.postingFrequency as FormData["postingFrequency"],
        ctaPreferences: existing.ctaPreferences ?? "",
        specialOffers: existing.specialOffers ?? "",
        autoApprove: existing.autoApprove,
        logoUrl: existing.logoUrl ?? "",
        postingTimes: (existing.customSchedule as { times?: string[] } | null)?.times?.length
          ? (existing.customSchedule as { times: string[] }).times
          : ["09:00"],
      });
    }
  }, [existing, reset]);

  const selectedPillars = watch("contentPillars");
  const logoUrl = watch("logoUrl");

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.url) {
        setValue("logoUrl", data.url);
        toast.success("Logo uploaded");
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingLogo(false);
    }
  }

  const togglePillar = (p: string) => {
    const current = selectedPillars ?? [];
    if (current.includes(p)) {
      setValue("contentPillars", current.filter((x) => x !== p));
    } else {
      setValue("contentPillars", [...current, p]);
    }
  };

  const onSubmit = (formData: FormData) => {
    const { postingTimes, ...rest } = formData;
    const data = { ...rest, customSchedule: { times: postingTimes } };
    if (isEdit && existingClientId) {
      updateClient.mutate({ clientId: existingClientId, data });
    } else {
      createClient.mutate(data);
    }
  };

  const isPending = createClient.isPending || updateClient.isPending;

  return (
    <div className="rounded-2xl border border-[#151f35] bg-[#0d1526] overflow-hidden">
      {/* Step indicator */}
      <div className="border-b border-[#151f35] p-5">
        <div className="flex items-center gap-0">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isDone = i < step;
            const isActive = i === step;
            return (
              <div key={s.label} className="flex items-center gap-0 flex-1">
                <button
                  type="button"
                  onClick={() => i < step && setStep(i)}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors",
                    isActive ? "text-violet-300" : isDone ? "text-slate-300" : "text-slate-600"
                  )}
                >
                  <span
                    className={cn(
                      "w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold border transition-all",
                      isDone
                        ? "bg-violet-600 border-violet-600 text-white"
                        : isActive
                        ? "border-violet-500 text-violet-300 bg-violet-500/10 shadow-[0_0_12px_rgba(139,92,246,0.25)]"
                        : "border-[#1a2540] text-slate-600"
                    )}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={cn("flex-1 h-px mx-3 transition-colors", isDone ? "bg-violet-600/50" : "bg-[#151f35]")} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        {step === 0 && (
          <>
            <div>
              <label className="text-sm font-medium text-slate-300">Client Logo</label>
              <p className="text-xs text-slate-500 mt-0.5">
                Used on the dashboard and composited onto every generated graphic
              </p>
              <div className="mt-2 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl border border-dashed border-[#1a2540] flex items-center justify-center overflow-hidden bg-[#06090f] shrink-0">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo preview" className="w-full h-full object-contain" />
                  ) : (
                    <Upload className="w-5 h-5 text-slate-600" />
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="flex items-center gap-1.5 text-sm border border-[#1a2540] text-slate-300 rounded-xl px-3 py-1.5 hover:bg-white/[0.04] transition-colors disabled:opacity-50"
                  >
                    {uploadingLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    {logoUrl ? "Replace" : "Upload"}
                  </button>
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => setValue("logoUrl", "")}
                      className="flex items-center gap-1.5 text-sm text-red-400 border border-red-500/20 rounded-xl px-3 py-1.5 hover:bg-red-500/5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  )}
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium text-slate-300">Business Name *</label>
                <input {...register("businessName")} className={inputClass} />
                {errors.businessName && <p className="text-xs text-red-400 mt-1">{errors.businessName.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Industry *</label>
                <select {...register("industry")} className={inputClass}>
                  <option value="">Select industry...</option>
                  {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Location</label>
                <input {...register("location")} placeholder="City, State" className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-slate-300">Website</label>
                <input {...register("website")} placeholder="https://" className={inputClass} />
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div>
              <label className="text-sm font-medium text-slate-300">Target Audience</label>
              <textarea
                {...register("targetAudience")}
                rows={2}
                placeholder="e.g., Small business owners aged 30-50 in the healthcare industry"
                className={cn(inputClass, "resize-none")}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Brand Voice</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {BRAND_VOICES.map((v) => {
                  const selected = watch("brandVoice") === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setValue("brandVoice", v)}
                      className={cn(
                        "text-sm py-2 rounded-xl border transition-colors",
                        selected
                          ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                          : "border-[#1a2540] text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                      )}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Additional Brand Voice Notes</label>
              <textarea
                {...register("brandVoiceNotes")}
                rows={3}
                placeholder="Any specific tone, phrases to use/avoid, personality traits..."
                className={cn(inputClass, "resize-none")}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">CTA Preferences</label>
              <input
                {...register("ctaPreferences")}
                placeholder="e.g., 'Visit us!', 'Book a free consultation', 'Shop now'"
                className={inputClass}
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label className="text-sm font-medium text-slate-300">Content Pillars</label>
              <p className="text-xs text-slate-500 mt-0.5">Select the topics that should drive your content</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {CONTENT_PILLARS_OPTIONS.map((p) => {
                  const selected = selectedPillars?.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePillar(p)}
                      className={cn(
                        "text-xs py-2 px-3 rounded-xl border text-left transition-colors",
                        selected
                          ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                          : "border-[#1a2540] text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                      )}
                    >
                      {selected ? "✓ " : ""}{p}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Posting Frequency</label>
              <div className="mt-2 space-y-2">
                {POSTING_FREQUENCIES.map((f) => {
                  const selected = watch("postingFrequency") === f.value;
                  return (
                    <label
                      key={f.value}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors",
                        selected ? "border-violet-500/50 bg-violet-500/10" : "border-[#1a2540] hover:bg-white/[0.04]"
                      )}
                    >
                      <input type="radio" value={f.value} {...register("postingFrequency")} className="accent-violet-500" />
                      <span className="text-sm text-slate-300">{f.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Posting Times</label>
              <p className="text-xs text-slate-500 mt-0.5">
                When &quot;Generate 30 Days&quot; runs, posts are automatically scheduled at these times so you
                don&apos;t have to set a date for each one.
              </p>
              <div className="mt-2 space-y-2">
                {(watch("postingTimes") ?? ["09:00"]).map((time, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => {
                        const next = [...(watch("postingTimes") ?? [])];
                        next[i] = e.target.value;
                        setValue("postingTimes", next);
                      }}
                      className="border border-[#1a2540] rounded-xl px-3 py-2 text-sm bg-[#06090f] text-slate-200 focus:outline-none focus:border-violet-500/50"
                    />
                    {(watch("postingTimes")?.length ?? 0) > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const next = (watch("postingTimes") ?? []).filter((_, idx) => idx !== i);
                          setValue("postingTimes", next);
                        }}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setValue("postingTimes", [...(watch("postingTimes") ?? []), "12:00"])}
                  className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  + Add another time
                </button>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="rounded-xl border border-[#1a2540] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-slate-200">Auto-Approve Content</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    AI-generated content will be automatically approved and scheduled. Disable to review manually.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                  <input type="checkbox" {...register("autoApprove")} className="sr-only peer" />
                  <div className="w-11 h-6 bg-[#1a2540] peer-checked:bg-violet-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                </label>
              </div>
            </div>
            <div className="rounded-xl bg-violet-500/[0.08] border border-violet-500/20 p-4 text-sm space-y-2">
              <p className="font-medium text-violet-300">What happens next?</p>
              <ul className="text-slate-400 space-y-1 text-xs">
                <li>✓ AI will generate your first 30 days of content</li>
                <li>✓ Images will be created and matched to each post</li>
                <li>✓ Quality validation runs automatically</li>
                <li>✓ You connect Facebook/Instagram accounts</li>
                <li>✓ Posts publish on your schedule, automatically</li>
              </ul>
            </div>
          </>
        )}

        <div className="flex gap-3 pt-2">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex-1 border border-[#1a2540] text-slate-300 rounded-xl py-2 text-sm font-medium hover:bg-white/[0.04] transition-colors"
            >
              Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex-1 bg-violet-600 hover:bg-violet-500 text-white rounded-xl py-2 text-sm font-medium transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-violet-600 hover:bg-violet-500 text-white rounded-xl py-2 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isPending ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save Changes" : "Create Client")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

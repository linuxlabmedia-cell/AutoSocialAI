"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/trpc-provider";
import { toast } from "sonner";

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
  ctaPreferences: z.string().optional(),
  specialOffers: z.string().optional(),
  autoApprove: z.boolean().default(false),
});

type FormData = z.infer<typeof schema>;

const STEPS = ["Basic Info", "Brand Voice", "Content Strategy", "Automation"];

export function ClientProfileForm({ existingClientId }: { existingClientId?: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
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
      });
    }
  }, [existing, reset]);

  const selectedPillars = watch("contentPillars");

  const togglePillar = (p: string) => {
    const current = selectedPillars ?? [];
    if (current.includes(p)) {
      setValue("contentPillars", current.filter((x) => x !== p));
    } else {
      setValue("contentPillars", [...current, p]);
    }
  };

  const onSubmit = (data: FormData) => {
    if (isEdit && existingClientId) {
      updateClient.mutate({ clientId: existingClientId, data });
    } else {
      createClient.mutate(data);
    }
  };

  const isPending = createClient.isPending || updateClient.isPending;

  return (
    <div className="bg-card border rounded-xl overflow-hidden">
      {/* Step indicator */}
      <div className="border-b p-4">
        <div className="flex items-center gap-0">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-0 flex-1">
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 text-sm font-medium ${
                  i === step ? "text-primary" : i < step ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < step
                      ? "bg-primary text-primary-foreground"
                      : i === step
                      ? "border-2 border-primary text-primary"
                      : "border border-muted-foreground text-muted-foreground"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </span>
                {s}
              </button>
              {i < STEPS.length - 1 && <div className="flex-1 h-px bg-border mx-3" />}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        {step === 0 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium">Business Name *</label>
                <input {...register("businessName")} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm bg-background" />
                {errors.businessName && <p className="text-xs text-red-500 mt-1">{errors.businessName.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Industry *</label>
                <select {...register("industry")} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm bg-background">
                  <option value="">Select industry...</option>
                  {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <input {...register("location")} placeholder="City, State" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm bg-background" />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium">Website</label>
                <input {...register("website")} placeholder="https://" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm bg-background" />
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div>
              <label className="text-sm font-medium">Target Audience</label>
              <textarea
                {...register("targetAudience")}
                rows={2}
                placeholder="e.g., Small business owners aged 30-50 in the healthcare industry"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm bg-background resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Brand Voice</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {BRAND_VOICES.map((v) => {
                  const selected = watch("brandVoice") === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setValue("brandVoice", v)}
                      className={`text-sm py-2 rounded-lg border transition-colors ${
                        selected ? "border-primary bg-primary/5 text-primary" : "hover:bg-muted"
                      }`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Additional Brand Voice Notes</label>
              <textarea
                {...register("brandVoiceNotes")}
                rows={3}
                placeholder="Any specific tone, phrases to use/avoid, personality traits..."
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm bg-background resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium">CTA Preferences</label>
              <input
                {...register("ctaPreferences")}
                placeholder="e.g., 'Visit us!', 'Book a free consultation', 'Shop now'"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm bg-background"
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label className="text-sm font-medium">Content Pillars</label>
              <p className="text-xs text-muted-foreground mt-0.5">Select the topics that should drive your content</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {CONTENT_PILLARS_OPTIONS.map((p) => {
                  const selected = selectedPillars?.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePillar(p)}
                      className={`text-xs py-2 px-3 rounded-lg border text-left transition-colors ${
                        selected ? "border-primary bg-primary/5 text-primary" : "hover:bg-muted"
                      }`}
                    >
                      {selected ? "✓ " : ""}{p}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Posting Frequency</label>
              <div className="mt-2 space-y-2">
                {POSTING_FREQUENCIES.map((f) => {
                  const selected = watch("postingFrequency") === f.value;
                  return (
                    <label key={f.value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selected ? "border-primary bg-primary/5" : "hover:bg-muted"}`}>
                      <input type="radio" value={f.value} {...register("postingFrequency")} className="text-primary" />
                      <span className="text-sm">{f.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="rounded-xl border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Auto-Approve Content</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    AI-generated content will be automatically approved and scheduled. Disable to review manually.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" {...register("autoApprove")} className="sr-only peer" />
                  <div className="w-11 h-6 bg-muted peer-checked:bg-primary rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
            <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 text-sm space-y-2">
              <p className="font-medium text-primary">What happens next?</p>
              <ul className="text-muted-foreground space-y-1 text-xs">
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
              className="flex-1 border rounded-lg py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isPending ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save Changes" : "Create Client")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

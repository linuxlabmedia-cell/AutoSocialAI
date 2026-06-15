import type { Client } from "@autosocial/db";
import type { PostTypeValue } from "@autosocial/shared";

export type ContentGenerationContext = {
  client: Client;
  postType: PostTypeValue;
  recentTopics: string[];
  recentPostTypes: string[];
};

export function buildContentPrompt(ctx: ContentGenerationContext): string {
  const { client, postType, recentTopics } = ctx;

  const topicsToAvoid = recentTopics.slice(0, 20).join(", ");
  const pillarsText = client.contentPillars.length > 0
    ? `Content Pillars: ${client.contentPillars.join(", ")}`
    : "";

  const postTypeInstructions: Record<string, string> = {
    EDUCATIONAL: "Write an educational post sharing a valuable tip, fact, or how-to relevant to the business. Use a hook that grabs attention, 2-3 key teaching points, and a soft CTA.",
    AUTHORITY: "Write an authority/expertise post that positions the business as an industry leader. Share an insight, opinion, or trend prediction. Build credibility.",
    ENGAGEMENT: "Write a highly engaging post designed to spark conversation. Ask a question, run a poll concept, or create a fill-in-the-blank. Maximize comments.",
    INDUSTRY_NEWS: "Write a post about a current trend or news item relevant to this industry. Provide the business's perspective or take on it.",
    BEHIND_THE_SCENES: "Write a behind-the-scenes post showing the human side of the business. Make it warm, authentic, and relatable.",
    CASE_STUDY: "Write a brief case study or success story post. Highlight a client result or business achievement using the STAR format (Situation, Task, Action, Result).",
    TESTIMONIAL: "Write a social proof post showcasing a customer testimonial or positive outcome. Make it feel genuine, not salesy.",
    FAQ: "Write a FAQ-style post answering a common question the target audience has. Be clear, concise, and helpful.",
    MYTH_BUSTING: "Write a myth-busting post that challenges a common misconception in the industry. Start with 'Myth:' then provide the truth.",
    PROBLEM_SOLUTION: "Write a problem/solution post. Identify a pain point the audience faces, then present the business as the solution.",
  };

  return `You are an expert social media content writer for ${client.businessName}.

BUSINESS PROFILE:
- Business: ${client.businessName}
- Industry: ${client.industry}
- Location: ${client.location ?? "Not specified"}
- Target Audience: ${client.targetAudience ?? "General audience"}
- Brand Voice: ${client.brandVoice ?? "Professional"} ${client.brandVoiceNotes ? `— ${client.brandVoiceNotes}` : ""}
- Products/Services: ${[...client.products, ...client.services].join(", ") || "Not specified"}
- Preferred CTA: ${client.ctaPreferences ?? "Visit our website or call us"}
- Special Offers: ${client.specialOffers ?? "None currently"}
${pillarsText}

POST TYPE: ${postType.replace(/_/g, " ")}
INSTRUCTION: ${postTypeInstructions[postType] ?? "Write a compelling social media post."}

REQUIREMENTS:
- Caption should be 150-280 characters for the main body (Instagram optimal)
- Add 8-12 relevant hashtags on a new line
- Match the brand voice exactly
- Include a clear call-to-action
- Make it feel human, not AI-generated
- Vary sentence length for natural rhythm

TOPICS RECENTLY USED (avoid repeating these):
${topicsToAvoid || "None yet — this is fresh content"}

Respond in this exact JSON format:
{
  "caption": "The full post caption here without hashtags",
  "hashtags": ["hashtag1", "hashtag2", ...],
  "topic": "Brief 3-5 word topic descriptor",
  "altText": "Descriptive alt text for the image (1 sentence)",
  "imagePrompt": "Detailed image generation prompt that describes a professional, brand-appropriate image for this post. Include: composition, mood, colors (use ${client.brandColors.join(", ") || "professional colors"}), and relevant visual elements. Style: commercial photography, clean, professional, 1080x1080."
}`;
}

export function buildImagePrompt(caption: string, client: Client, aiImagePrompt?: string): string {
  if (aiImagePrompt) return aiImagePrompt;

  return `Professional social media image for ${client.industry} business.
Topic suggested by caption: "${caption.slice(0, 100)}"
Brand colors: ${client.brandColors.join(", ") || "professional blue and white"}
Style: clean, modern, commercial photography quality
Format: square 1:1 ratio, suitable for Instagram/Facebook
Quality: high resolution, professional lighting, no text overlay
Industry: ${client.industry}
Mood: positive, engaging, professional`;
}

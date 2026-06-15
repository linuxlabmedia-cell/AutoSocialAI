export const POST_TYPES = [
  { value: "EDUCATIONAL", label: "Educational", emoji: "📚", weight: 25 },
  { value: "AUTHORITY", label: "Authority", emoji: "🏆", weight: 15 },
  { value: "ENGAGEMENT", label: "Engagement", emoji: "💬", weight: 20 },
  { value: "INDUSTRY_NEWS", label: "Industry News", emoji: "📰", weight: 10 },
  { value: "BEHIND_THE_SCENES", label: "Behind The Scenes", emoji: "🎬", weight: 10 },
  { value: "CASE_STUDY", label: "Case Study", emoji: "📊", weight: 5 },
  { value: "TESTIMONIAL", label: "Testimonial", emoji: "⭐", weight: 5 },
  { value: "FAQ", label: "FAQ", emoji: "❓", weight: 5 },
  { value: "MYTH_BUSTING", label: "Myth Busting", emoji: "🚫", weight: 2.5 },
  { value: "PROBLEM_SOLUTION", label: "Problem/Solution", emoji: "💡", weight: 2.5 },
] as const;

export type PostTypeValue = (typeof POST_TYPES)[number]["value"];

// Weighted random selection for content diversity
export function selectWeightedPostType(recentTypes: PostTypeValue[]): PostTypeValue {
  const recentCounts = recentTypes.reduce(
    (acc, t) => ({ ...acc, [t]: (acc[t] ?? 0) + 1 }),
    {} as Record<string, number>
  );

  const weighted = POST_TYPES.map((pt) => ({
    ...pt,
    adjustedWeight: pt.weight / (1 + (recentCounts[pt.value] ?? 0) * 0.5),
  }));

  const total = weighted.reduce((sum, pt) => sum + pt.adjustedWeight, 0);
  let rand = Math.random() * total;

  for (const pt of weighted) {
    rand -= pt.adjustedWeight;
    if (rand <= 0) return pt.value as PostTypeValue;
  }

  return "EDUCATIONAL";
}

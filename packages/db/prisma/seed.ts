import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// ─────────────────────────────────────────────────────────────
// INDUSTRIES
// ─────────────────────────────────────────────────────────────

const industries = [
  {
    name: "Real Estate",
    slug: "real-estate",
    description: "Residential and commercial property buying, selling, and investment",
    keywords: ["homes", "properties", "listings", "buyers", "sellers", "investment", "market", "equity"],
    tone: "Professional, aspirational, trustworthy, market-savvy",
    visualStyle: "Clean white spaces, aerial property photography, modern sans-serif typography, luxury aesthetics",
    suggestedCtaTypes: ["Schedule a Showing", "Get a Free Home Valuation", "Search Listings", "Call Now"],
    compatibleCategories: ["website-design", "meta-ads", "seo", "social-media", "lead-generation", "branding", "content-management"],
    sortOrder: 1,
  },
  {
    name: "Property Management",
    slug: "property-management",
    description: "Residential and commercial property management, tenant relations, and maintenance coordination",
    keywords: ["tenants", "rentals", "maintenance", "leases", "landlords", "vacancies", "property care"],
    tone: "Reliable, professional, solution-oriented, trustworthy",
    visualStyle: "Organized, clean layouts, property imagery, dashboard-style graphics, calm blues and greens",
    suggestedCtaTypes: ["Request a Free Property Analysis", "Get a Rental Quote", "Schedule a Consultation", "Learn More"],
    compatibleCategories: ["website-design", "meta-ads", "seo", "social-media", "lead-generation", "content-management"],
    sortOrder: 2,
  },
  {
    name: "Mortgage Brokers",
    slug: "mortgage",
    description: "Home loan origination, refinancing, and mortgage advisory services",
    keywords: ["loans", "rates", "refinance", "pre-approval", "home financing", "interest rates", "lenders"],
    tone: "Trustworthy, educational, empowering, financially savvy",
    visualStyle: "Clean financial aesthetics, blue and gold palette, home imagery, data-driven infographics",
    suggestedCtaTypes: ["Get Pre-Approved Today", "Check Your Rate", "Free Consultation", "Apply Now"],
    compatibleCategories: ["website-design", "meta-ads", "seo", "social-media", "lead-generation", "branding"],
    sortOrder: 3,
  },
  {
    name: "Insurance Agencies",
    slug: "insurance",
    description: "Personal, commercial, and specialty insurance products and advisory services",
    keywords: ["coverage", "policy", "protection", "premiums", "claims", "risk", "security"],
    tone: "Reassuring, protective, professional, straightforward",
    visualStyle: "Shield and protection imagery, calm blues, family-focused photography, clear typography",
    suggestedCtaTypes: ["Get a Free Quote", "Compare Plans", "Speak with an Agent", "Protect Yourself Today"],
    compatibleCategories: ["website-design", "meta-ads", "seo", "social-media", "lead-generation", "content-management"],
    sortOrder: 4,
  },
  {
    name: "Financial Advisors",
    slug: "financial-advisors",
    description: "Wealth management, investment planning, retirement, and financial advisory services",
    keywords: ["wealth", "investments", "retirement", "portfolio", "financial planning", "assets", "growth"],
    tone: "Sophisticated, educational, trustworthy, authoritative",
    visualStyle: "Premium dark themes, gold accents, charts and graphs, aspirational lifestyle imagery",
    suggestedCtaTypes: ["Schedule a Free Consultation", "Build Your Plan", "Review Your Portfolio", "Start Planning"],
    compatibleCategories: ["website-design", "meta-ads", "seo", "social-media", "lead-generation", "branding", "content-management"],
    sortOrder: 5,
  },
  {
    name: "Law Firms",
    slug: "law-firms",
    description: "Legal services including litigation, corporate law, family law, and personal injury",
    keywords: ["attorney", "legal", "counsel", "litigation", "rights", "justice", "representation"],
    tone: "Authoritative, professional, empathetic, results-driven",
    visualStyle: "Dark navy and gold, professional office imagery, strong typography, serious and commanding",
    suggestedCtaTypes: ["Free Case Evaluation", "Speak with an Attorney", "Know Your Rights", "Get Legal Help"],
    compatibleCategories: ["website-design", "meta-ads", "seo", "social-media", "lead-generation", "branding"],
    sortOrder: 6,
  },
  {
    name: "Medical Practices",
    slug: "medical",
    description: "General and specialty medical care, patient services, and healthcare practices",
    keywords: ["patients", "health", "care", "treatments", "physicians", "wellness", "appointments"],
    tone: "Caring, professional, reassuring, credible",
    visualStyle: "Clean whites and blues, modern medical imagery, caring photography, clean typography",
    suggestedCtaTypes: ["Book an Appointment", "New Patient Offer", "Learn More", "Call Our Office"],
    compatibleCategories: ["website-design", "meta-ads", "seo", "social-media", "lead-generation", "content-management"],
    sortOrder: 7,
  },
  {
    name: "Dental Clinics",
    slug: "dental",
    description: "General dentistry, cosmetic dentistry, orthodontics, and oral health services",
    keywords: ["teeth", "smile", "dental care", "cleanings", "whitening", "implants", "orthodontics"],
    tone: "Friendly, professional, confident, welcoming",
    visualStyle: "Bright whites, smile photography, clean modern design, teal and blue accents",
    suggestedCtaTypes: ["Book a Cleaning", "Free Consultation", "Smile Makeover Quote", "New Patient Special"],
    compatibleCategories: ["website-design", "meta-ads", "seo", "social-media", "lead-generation", "branding"],
    sortOrder: 8,
  },
  {
    name: "Chiropractors",
    slug: "chiropractic",
    description: "Chiropractic care, spinal adjustments, pain relief, and wellness services",
    keywords: ["spine", "alignment", "pain relief", "wellness", "adjustments", "back pain", "neck pain"],
    tone: "Caring, empowering, health-focused, professional",
    visualStyle: "Clean health aesthetics, active lifestyle photography, green and white palette, wellness imagery",
    suggestedCtaTypes: ["Book Your Adjustment", "Free Consultation", "Get Relief Today", "Schedule Now"],
    compatibleCategories: ["website-design", "meta-ads", "seo", "social-media", "lead-generation", "content-management"],
    sortOrder: 9,
  },
  {
    name: "Home Services",
    slug: "home-services",
    description: "General home improvement, repair, and maintenance service businesses",
    keywords: ["repairs", "home improvement", "contractors", "installations", "maintenance", "service"],
    tone: "Reliable, skilled, friendly, local",
    visualStyle: "Before/after imagery, tool and workmanship photography, bold and trustworthy design",
    suggestedCtaTypes: ["Get a Free Estimate", "Book a Service", "Call Now", "Request a Quote"],
    compatibleCategories: ["website-design", "meta-ads", "seo", "social-media", "lead-generation", "branding"],
    sortOrder: 10,
  },
  {
    name: "Roofing",
    slug: "roofing",
    description: "Residential and commercial roofing installation, repair, and replacement",
    keywords: ["roof", "shingles", "repair", "replacement", "gutters", "storm damage", "inspection"],
    tone: "Reliable, urgent (storm response), professional, local",
    visualStyle: "Bold before/after imagery, aerial roof photography, blue and charcoal palette",
    suggestedCtaTypes: ["Free Roof Inspection", "Storm Damage? Call Now", "Get a Quote", "Book Today"],
    compatibleCategories: ["website-design", "meta-ads", "seo", "social-media", "lead-generation"],
    sortOrder: 11,
  },
  {
    name: "HVAC",
    slug: "hvac",
    description: "Heating, ventilation, and air conditioning installation, repair, and maintenance",
    keywords: ["AC", "heating", "cooling", "HVAC", "furnace", "maintenance", "installation", "repair"],
    tone: "Reliable, urgent (comfort-driven), professional, seasonal",
    visualStyle: "Cool blues, comfortable home imagery, clean technical design, energy-efficient messaging",
    suggestedCtaTypes: ["Schedule a Tune-Up", "24/7 Emergency Service", "Free Estimate", "Book Now"],
    compatibleCategories: ["website-design", "meta-ads", "seo", "social-media", "lead-generation"],
    sortOrder: 12,
  },
  {
    name: "Plumbing",
    slug: "plumbing",
    description: "Residential and commercial plumbing services, repairs, and installations",
    keywords: ["plumber", "pipes", "leaks", "drains", "water heater", "repairs", "installations"],
    tone: "Urgent (emergency-ready), reliable, professional, approachable",
    visualStyle: "Blue water tones, professional service imagery, before/after, clean and trustworthy",
    suggestedCtaTypes: ["Emergency Service Available", "Get a Free Quote", "Book a Plumber", "Call Now"],
    compatibleCategories: ["website-design", "meta-ads", "seo", "social-media", "lead-generation"],
    sortOrder: 13,
  },
  {
    name: "Electrical",
    slug: "electrical",
    description: "Residential and commercial electrical services, wiring, panels, and repairs",
    keywords: ["electrician", "wiring", "panels", "outlets", "electrical repairs", "lighting", "safety"],
    tone: "Safety-focused, professional, reliable, urgent",
    visualStyle: "Bold yellows and blacks, safety imagery, professional service photography, strong typography",
    suggestedCtaTypes: ["Free Electrical Inspection", "Emergency Service", "Get a Quote", "Book Now"],
    compatibleCategories: ["website-design", "meta-ads", "seo", "social-media", "lead-generation"],
    sortOrder: 14,
  },
  {
    name: "Landscaping",
    slug: "landscaping",
    description: "Lawn care, landscape design, irrigation, and outdoor beautification services",
    keywords: ["lawn", "landscaping", "garden", "irrigation", "lawn care", "outdoor design", "curb appeal"],
    tone: "Beautiful, natural, professional, seasonal",
    visualStyle: "Lush green imagery, before/after transformation photos, earthy tones, outdoor lifestyle",
    suggestedCtaTypes: ["Get a Free Estimate", "Transform Your Yard", "Book a Consultation", "Call Today"],
    compatibleCategories: ["website-design", "meta-ads", "seo", "social-media", "lead-generation", "branding"],
    sortOrder: 15,
  },
  {
    name: "Construction",
    slug: "construction",
    description: "Residential and commercial construction, renovation, and building services",
    keywords: ["construction", "building", "renovation", "contractors", "commercial", "residential", "projects"],
    tone: "Powerful, professional, results-driven, experienced",
    visualStyle: "Bold industrial aesthetics, project photography, before/after, strong typography, dark palette",
    suggestedCtaTypes: ["Get a Free Estimate", "View Our Projects", "Start Your Build", "Request a Quote"],
    compatibleCategories: ["website-design", "meta-ads", "seo", "social-media", "lead-generation", "branding"],
    sortOrder: 16,
  },
  {
    name: "Restaurants",
    slug: "restaurants",
    description: "Full-service dining restaurants, casual eateries, and food establishments",
    keywords: ["dining", "food", "menu", "reservations", "cuisine", "chef", "experience"],
    tone: "Appetizing, inviting, experiential, passionate",
    visualStyle: "Rich food photography, warm ambiance imagery, menu graphics, inviting typography",
    suggestedCtaTypes: ["Reserve a Table", "Order Online", "View Menu", "Visit Us Today"],
    compatibleCategories: ["website-design", "meta-ads", "social-media", "lead-generation", "branding", "content-management"],
    sortOrder: 17,
  },
  {
    name: "Cafes",
    slug: "cafes",
    description: "Coffee shops, cafes, and light dining establishments",
    keywords: ["coffee", "cafe", "espresso", "pastries", "brunch", "community", "ambiance"],
    tone: "Warm, cozy, community-driven, artisan",
    visualStyle: "Warm browns and creams, latte art photography, cozy ambiance, handcrafted aesthetics",
    suggestedCtaTypes: ["Visit Us Today", "Order Online", "See Our Menu", "Follow for Daily Specials"],
    compatibleCategories: ["website-design", "meta-ads", "social-media", "branding", "content-management"],
    sortOrder: 18,
  },
  {
    name: "Fitness Gyms",
    slug: "fitness-gyms",
    description: "Fitness centers, gyms, and health clubs offering memberships and group classes",
    keywords: ["fitness", "gym", "workouts", "membership", "classes", "training", "health"],
    tone: "Motivating, energetic, empowering, community-focused",
    visualStyle: "High-energy photography, bold typography, dark dramatic backgrounds, vibrant accent colors",
    suggestedCtaTypes: ["Free Trial Week", "Join Today", "Book a Class", "Get Started"],
    compatibleCategories: ["website-design", "meta-ads", "social-media", "lead-generation", "branding", "content-management"],
    sortOrder: 19,
  },
  {
    name: "Personal Trainers",
    slug: "personal-trainers",
    description: "One-on-one personal training, online coaching, and fitness programs",
    keywords: ["personal training", "coaching", "transformation", "fitness goals", "accountability", "results"],
    tone: "Motivating, personal, results-driven, relatable",
    visualStyle: "Transformation photography, action shots, before/after, bold motivational typography",
    suggestedCtaTypes: ["Book a Free Session", "Start Your Transformation", "Apply Now", "DM to Get Started"],
    compatibleCategories: ["website-design", "meta-ads", "social-media", "lead-generation", "branding", "content-management"],
    sortOrder: 20,
  },
  {
    name: "Automotive",
    slug: "automotive",
    description: "General automotive services, vehicle sales, and car-related businesses",
    keywords: ["vehicles", "cars", "auto", "driving", "transportation", "fleet"],
    tone: "Bold, exciting, trustworthy, performance-driven",
    visualStyle: "Dramatic vehicle photography, sleek dark themes, motion blur, high-contrast design",
    suggestedCtaTypes: ["Schedule a Test Drive", "Get a Quote", "Visit Our Lot", "Book Service"],
    compatibleCategories: ["website-design", "meta-ads", "seo", "social-media", "lead-generation", "branding"],
    sortOrder: 21,
  },
  {
    name: "Car Dealerships",
    slug: "car-dealerships",
    description: "New and used vehicle sales, financing, and automotive retail",
    keywords: ["dealership", "inventory", "new cars", "used cars", "financing", "trade-in", "test drive"],
    tone: "Exciting, value-driven, trustworthy, promotional",
    visualStyle: "Showroom photography, vehicle highlights, financing graphics, bold promotional design",
    suggestedCtaTypes: ["Shop Inventory", "Get Pre-Approved", "Schedule a Test Drive", "See Today's Deals"],
    compatibleCategories: ["website-design", "meta-ads", "seo", "social-media", "lead-generation"],
    sortOrder: 22,
  },
  {
    name: "Auto Repair",
    slug: "auto-repair",
    description: "Vehicle maintenance, mechanical repairs, and auto service centers",
    keywords: ["auto repair", "mechanic", "oil change", "brakes", "tires", "diagnostics", "maintenance"],
    tone: "Trustworthy, reliable, honest, urgent",
    visualStyle: "Shop photography, vehicle close-ups, mechanic imagery, bold and trustworthy design",
    suggestedCtaTypes: ["Schedule Service", "Get a Free Estimate", "Call Now", "Book Online"],
    compatibleCategories: ["website-design", "meta-ads", "seo", "social-media", "lead-generation"],
    sortOrder: 23,
  },
  {
    name: "E-Commerce",
    slug: "ecommerce",
    description: "Online retail businesses, product brands, and digital storefronts",
    keywords: ["online store", "products", "shopping", "shipping", "brand", "catalog", "checkout"],
    tone: "Exciting, aspirational, product-focused, promotional",
    visualStyle: "Product photography, lifestyle imagery, clean white backgrounds, bold promotional design",
    suggestedCtaTypes: ["Shop Now", "Limited Time Offer", "Free Shipping", "Explore Collection"],
    compatibleCategories: ["website-design", "meta-ads", "social-media", "lead-generation", "branding", "content-management"],
    sortOrder: 24,
  },
  {
    name: "Retail",
    slug: "retail",
    description: "Brick-and-mortar retail stores, boutiques, and local shopping destinations",
    keywords: ["store", "products", "shopping", "sale", "in-store", "local", "boutique"],
    tone: "Friendly, promotional, local, inviting",
    visualStyle: "Product and store photography, warm inviting design, sale graphics, community feel",
    suggestedCtaTypes: ["Visit Our Store", "Shop the Sale", "New Arrivals", "See What's In Stock"],
    compatibleCategories: ["website-design", "meta-ads", "social-media", "lead-generation", "branding"],
    sortOrder: 25,
  },
  {
    name: "Beauty Salons",
    slug: "beauty-salons",
    description: "Hair salons, nail studios, and beauty service businesses",
    keywords: ["hair", "nails", "beauty", "salon", "styling", "color", "extensions", "blowout"],
    tone: "Glamorous, inviting, trendy, confidence-building",
    visualStyle: "Glam photography, before/after transformations, rose gold and neutral palette, aspirational",
    suggestedCtaTypes: ["Book an Appointment", "See Our Work", "New Client Special", "Book Online"],
    compatibleCategories: ["website-design", "meta-ads", "seo", "social-media", "lead-generation", "branding"],
    sortOrder: 26,
  },
  {
    name: "Spas",
    slug: "spas",
    description: "Day spas, massage therapy, skincare, and wellness retreat centers",
    keywords: ["relaxation", "massage", "skincare", "facial", "wellness", "rejuvenation", "self-care"],
    tone: "Serene, luxurious, restorative, inviting",
    visualStyle: "Soft neutrals, spa imagery, tranquil settings, watercolor-inspired, flowing typography",
    suggestedCtaTypes: ["Book a Treatment", "Gift a Spa Day", "Explore Services", "Reserve Now"],
    compatibleCategories: ["website-design", "meta-ads", "seo", "social-media", "lead-generation", "branding"],
    sortOrder: 27,
  },
  {
    name: "Marketing Agencies",
    slug: "marketing-agencies",
    description: "Digital marketing, advertising, and creative agencies serving business clients",
    keywords: ["marketing", "campaigns", "strategy", "results", "ROI", "clients", "growth"],
    tone: "Results-driven, creative, confident, authoritative",
    visualStyle: "Bold modern design, data visualizations, campaign examples, dark premium aesthetics",
    suggestedCtaTypes: ["Get a Free Strategy Call", "See Our Results", "Work With Us", "Start Growing"],
    compatibleCategories: ["website-design", "meta-ads", "seo", "social-media", "lead-generation", "branding", "content-management"],
    sortOrder: 28,
  },
  {
    name: "SaaS Companies",
    slug: "saas",
    description: "Software-as-a-service products, apps, and technology platforms",
    keywords: ["software", "platform", "app", "features", "users", "subscriptions", "integration", "automation"],
    tone: "Innovative, authoritative, solution-focused, growth-minded",
    visualStyle: "Product screenshots, clean UI mockups, dark mode aesthetics, tech-forward design",
    suggestedCtaTypes: ["Start Free Trial", "Book a Demo", "See Features", "Get Started Free"],
    compatibleCategories: ["website-design", "meta-ads", "seo", "social-media", "lead-generation", "branding", "content-management"],
    sortOrder: 29,
  },
  {
    name: "Business Consultants",
    slug: "business-consultants",
    description: "Business strategy, operations, growth consulting, and advisory services",
    keywords: ["consulting", "strategy", "growth", "operations", "efficiency", "revenue", "advisory"],
    tone: "Authoritative, results-driven, educational, executive-level",
    visualStyle: "Professional dark palette, boardroom imagery, charts and data, premium executive aesthetics",
    suggestedCtaTypes: ["Book a Strategy Session", "Free Business Audit", "Apply to Work With Us", "Learn More"],
    compatibleCategories: ["website-design", "meta-ads", "seo", "social-media", "lead-generation", "branding", "content-management"],
    sortOrder: 30,
  },
];

// ─────────────────────────────────────────────────────────────
// SERVICE CATEGORIES
// ─────────────────────────────────────────────────────────────

const serviceCategories = [
  {
    name: "Website Design & Development",
    slug: "website-design",
    description: "Custom website design, responsive development, and conversion-optimized web solutions for local businesses",
    contentStrategy: "Focus on professionalism, credibility, and digital transformation. Show the business impact of great web design — more leads, better first impressions, higher conversions. Position the client as modern and credible.",
    designRules: "Show device mockups (laptop + mobile). Use clean modern layouts. High contrast typography. Before/after redesign comparisons where applicable. Premium, polished appearance required.",
    aiPromptFramework: "Professional marketing graphic for website design services. Show realistic website mockup displayed on modern device frames (MacBook laptop and iPhone side by side). Clean modern web interface visible. Typography overlay with headline. Background: subtle gradient or dark tech environment. Include service category badge. Premium marketing agency aesthetic.",
    sortOrder: 1,
  },
  {
    name: "Website Management",
    slug: "website-management",
    description: "Ongoing website maintenance, security updates, performance monitoring, and technical support",
    contentStrategy: "Build trust through reliability and technical expertise. Emphasize peace of mind, uptime, security, and letting business owners focus on their business while the website is handled professionally.",
    designRules: "Dashboard and monitoring aesthetic elements. Security shield or checkmark indicators. Uptime percentage displays. Analytics-style visuals. Professional technical styling. Green success indicators preferred.",
    aiPromptFramework: "Professional marketing graphic for website management services. Show dashboard interface with website health metrics, uptime indicators, security badges. Clean technical design. Green success indicators. Professional monitoring aesthetic. Business owner shown stress-free while website runs in background.",
    sortOrder: 2,
  },
  {
    name: "Content Management",
    slug: "content-management",
    description: "Strategic content creation, content calendar management, and consistent brand storytelling",
    contentStrategy: "Position businesses as active, educational, authoritative, and consistent online. Show the value of regular high-quality content in building audience trust and driving organic growth.",
    designRules: "Content calendar visuals. Social media post previews. Educational layouts. Strong branding visible. Consistent color system. Show organized content strategy at a glance.",
    aiPromptFramework: "Professional marketing graphic for content management services. Show organized content calendar layout with branded social posts arranged systematically. Include platform icons. Calendar grid elements. Professional content agency aesthetic. Brand colors prominent. Clean organized design.",
    sortOrder: 3,
  },
  {
    name: "Meta Ads Management",
    slug: "meta-ads",
    description: "Facebook and Instagram advertising campaign management, targeting, optimization, and ROI reporting",
    contentStrategy: "Focus on measurable business growth and ROI. Use real-looking metrics to demonstrate value. Show the direct connection between ad spend and business results — leads, appointments, revenue.",
    designRules: "Dashboard-style layouts with metrics. Graphs and charts showing growth. KPI numbers prominently displayed. Facebook and Instagram platform elements. Performance indicator colors (green = good).",
    aiPromptFramework: "Professional marketing graphic for Meta Ads results. Show dashboard-style layout with key metrics: cost per lead, ROAS, conversion rate displayed as clean data visualization. Facebook/Instagram logo elements. Green upward trend arrows. Dark dashboard aesthetic with glowing metrics. Agency results presentation style.",
    sortOrder: 4,
  },
  {
    name: "SEO",
    slug: "seo",
    description: "Search engine optimization, local SEO, keyword ranking, and organic traffic growth",
    contentStrategy: "Focus on long-term visibility, traffic growth, authority, and local search dominance. Educate on the value of organic ranking vs paid. Show rankings, traffic data, and local map pack wins.",
    designRules: "Search result visuals (Google SERP mockups). Keyword ranking charts showing upward movement. Traffic graphs with growth curves. Analytics dashboard elements. Local map pack imagery.",
    aiPromptFramework: "Professional marketing graphic for SEO results. Show stylized Google search results page with business ranking at #1 position. Upward trending traffic graph. Keyword ranking improvement chart. Green performance indicators. Clean analytics dashboard aesthetic. Local map pack element if applicable.",
    sortOrder: 5,
  },
  {
    name: "Social Media Management",
    slug: "social-media",
    description: "Full social media management, content creation, community engagement, and growth strategy",
    contentStrategy: "Build awareness, trust, engagement, and community. Show social proof through follower growth and engagement metrics. Demonstrate consistent brand presence and audience connection.",
    designRules: "Platform interface mockups (Instagram grid, Facebook page). Engagement metrics displayed. Follower count growth visualization. Content calendar preview. Brand consistency across posts shown.",
    aiPromptFramework: "Professional marketing graphic for social media management services. Show Instagram or Facebook interface mockup with branded content grid. Engagement metrics overlay: likes, comments, shares, follower count. Growth chart trending up. Platform-native aesthetic. Agency portfolio presentation style.",
    sortOrder: 6,
  },
  {
    name: "Lead Generation",
    slug: "lead-generation",
    description: "Multi-channel lead generation, appointment booking, funnel optimization, and client acquisition",
    contentStrategy: "Focus on business outcomes: appointments booked, opportunities created, revenue generated. Show the pipeline from prospect to paying client. Use numbers and results to prove value.",
    designRules: "Funnel graphic elements (wide top, narrow bottom). CRM-style contact list visuals. Conversion metrics prominently shown. Pipeline stage indicators. Revenue attribution numbers.",
    aiPromptFramework: "Professional marketing graphic for lead generation results. Show clean sales funnel visualization with lead count at top narrowing to appointments and clients. Contact list elements. Revenue metrics. Green conversion indicators. CRM-style dashboard aesthetic. Business growth visualization.",
    sortOrder: 7,
  },
  {
    name: "Branding",
    slug: "branding",
    description: "Brand identity design, logo creation, visual systems, and brand strategy",
    contentStrategy: "Build credibility, recognition, and emotional connection. Show the transformation from generic to premium brand. Demonstrate how strong branding commands higher prices and attracts better clients.",
    designRules: "Premium presentation quality required. Logo displayed prominently. Color palette swatches shown. Typography system visible. Brand elements arranged in professional brand board layout.",
    aiPromptFramework: "Professional marketing graphic for branding services. Show premium brand board layout with logo centered, color palette swatches below, typography specimens, and brand pattern elements. Clean white or dark background. Premium design agency aesthetic. Before/after brand transformation if applicable.",
    sortOrder: 8,
  },
];

// ─────────────────────────────────────────────────────────────
// TEMPLATES (8 per service category = 64 total)
// ─────────────────────────────────────────────────────────────

function makeTemplates(organizationId: string) {
  return [
    // ── WEBSITE DESIGN & DEVELOPMENT ───────────────────────
    {
      organizationId,
      name: "New Website Launch",
      category: "New Website Launch",
      serviceCategory: "website-design",
      industries: ["real-estate", "property-management", "mortgage", "insurance", "financial-advisors", "law-firms", "medical", "dental", "chiropractic", "home-services", "roofing", "hvac", "plumbing", "electrical", "landscaping", "construction", "restaurants", "cafes", "fitness-gyms", "personal-trainers", "automotive", "car-dealerships", "auto-repair", "ecommerce", "retail", "beauty-salons", "spas", "marketing-agencies", "saas", "business-consultants"],
      description: "Announce a brand new website launch with excitement and professionalism",
      contentStrategy: "Build anticipation and credibility around going live with a new professional website. Highlight modern design, mobile responsiveness, and the business benefits of the upgrade.",
      marketingObjective: "Brand Awareness",
      emotionalObjective: "Excite",
      promptFramework: `Professional social media announcement graphic for a new website launch.

Layout: Modern split-design with [BRAND_COLORS] as primary palette. Website mockup displayed on MacBook laptop frame (left side), business name and launch announcement on the right.

Text overlay:
- Large bold headline: "[HEADLINE]"
- Supporting line: "[SUPPORTING_TEXT]"
- CTA button: "[CTA]"
- Business name: "[BUSINESS_NAME]"

Design elements:
- Website preview showing clean, professional homepage
- Celebration confetti or launch rocket subtle graphic
- "Now Live" badge in accent color
- Clean modern sans-serif typography
- Professional gradient background in [BRAND_COLORS]

Photography: Modern device mockup on subtle tech-inspired background. Premium digital agency aesthetic. No text visible inside the mockup screen except "www.[BUSINESS_NAME].com".`,
      designRules: "Device mockup required. Celebration launch energy. Professional not flashy. Business name prominently featured.",
      isActive: true,
    },
    {
      organizationId,
      name: "Website Redesign Showcase",
      category: "Website Redesign",
      serviceCategory: "website-design",
      industries: ["real-estate", "property-management", "insurance", "financial-advisors", "law-firms", "medical", "dental", "beauty-salons", "spas", "marketing-agencies", "business-consultants"],
      description: "Showcase a stunning website redesign with before/after comparison",
      contentStrategy: "Demonstrate the dramatic improvement of a professional redesign. Before/after comparisons are highly effective for showing transformation value.",
      marketingObjective: "Trust Building",
      emotionalObjective: "Inspire",
      promptFramework: `Before/after website redesign comparison graphic for social media.

Layout: Side-by-side split design. Left half labeled "BEFORE" with outdated website mockup. Right half labeled "AFTER" with modern redesigned version showing [BUSINESS_NAME] branding.

Text overlay:
- Bold headline: "[HEADLINE]"
- Supporting text: "[SUPPORTING_TEXT]"
- CTA badge: "[CTA]"
- Business name: "[BUSINESS_NAME]"

Design elements:
- Clear "BEFORE" and "AFTER" labels in contrasting typography
- Arrow or transformation symbol between panels
- Modern color scheme from [BRAND_COLORS] visible in "after" version
- Professional overlay bar at bottom with CTA

Background: Clean white or dark neutral. High contrast between old and new designs. Premium transformation aesthetic.`,
      designRules: "Before/after split layout. Clear improvement visible. Labels required. Professional transformation story.",
      isActive: true,
    },
    {
      organizationId,
      name: "Mobile Optimization Feature",
      category: "Mobile Optimization",
      serviceCategory: "website-design",
      industries: ["real-estate", "property-management", "restaurants", "cafes", "fitness-gyms", "beauty-salons", "retail", "medical", "dental"],
      description: "Highlight mobile-friendly website design and responsive optimization benefits",
      contentStrategy: "Educate on the importance of mobile-first design. Most local business customers browse on phones — a mobile-optimized site converts dramatically better.",
      marketingObjective: "Education",
      emotionalObjective: "Educate",
      promptFramework: `Mobile-first website design education graphic for social media.

Layout: Centered mobile device focus. Smartphone (iPhone mockup) prominently featured showing mobile-optimized website. Clean data stat on the left or right.

Text overlay:
- Headline stat: "[HEADLINE]"
- Supporting text: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]" branding

Design elements:
- iPhone Pro mockup with mobile website visible
- "Mobile Optimized" checkmark badge
- Stat graphic: "73% of users browse on mobile"
- Fast loading indicator (lightning bolt icon)
- [BRAND_COLORS] as background accent

Professional tech-forward design. Educational infographic feel. Clean typography. No clutter.`,
      designRules: "Mobile device mockup centered. Stat included for authority. Educational tone.",
      isActive: true,
    },
    {
      organizationId,
      name: "Conversion Rate Improvement",
      category: "Conversion Improvement",
      serviceCategory: "website-design",
      industries: ["real-estate", "insurance", "financial-advisors", "law-firms", "medical", "dental", "fitness-gyms", "marketing-agencies", "saas", "business-consultants"],
      description: "Show how conversion-optimized design turns more website visitors into leads",
      contentStrategy: "Connect website design directly to business results. Show the revenue impact of improving conversion rates — even small improvements create major revenue growth.",
      marketingObjective: "Lead Generation",
      emotionalObjective: "Motivate",
      promptFramework: `Website conversion optimization results graphic for social media.

Layout: Dashboard-style data presentation. Conversion funnel visualization center. Metrics displayed prominently.

Text overlay:
- Bold headline: "[HEADLINE]"
- Supporting text: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Upward trending conversion rate graph in [BRAND_COLORS]
- Before/after conversion percentages displayed clearly
- Dollar sign or revenue indicator
- "More Leads" badge with arrow up
- Clean analytics dashboard aesthetic
- Green improvement color accents

Dark or white background. Data-driven premium look. Business results focus.`,
      designRules: "Data visualization required. Upward trend visuals. ROI-focused messaging.",
      isActive: true,
    },
    {
      organizationId,
      name: "Website Speed Upgrade",
      category: "Website Speed Upgrade",
      serviceCategory: "website-design",
      industries: ["ecommerce", "saas", "restaurants", "medical", "dental", "real-estate", "marketing-agencies"],
      description: "Highlight the business impact of a fast-loading, performance-optimized website",
      contentStrategy: "Speed = money. Educate on how page load times directly impact bounce rates, SEO rankings, and conversion rates. Fast websites win more customers.",
      marketingObjective: "Education",
      emotionalObjective: "Educate",
      promptFramework: `Website speed optimization marketing graphic.

Layout: Speed-focused design with lightning bolt motif. Speed score visualization (like Google PageSpeed) prominently shown.

Text overlay:
- Headline: "[HEADLINE]"
- Supporting text: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Speed gauge or score display going from red (slow) to green (fast)
- Lightning bolt icon in [BRAND_COLORS] accent
- Load time comparison: "Old: 8s → New: 1.2s"
- "3x Faster" badge
- Minimal clean background — white or dark tech
- Google PageSpeed-inspired visual elements

Fast, energetic design feel. Performance focus. Professional metrics display.`,
      designRules: "Speed metric visualization required. Before/after load times. Performance-forward design.",
      isActive: true,
    },
    {
      organizationId,
      name: "Landing Page Launch",
      category: "Landing Page Launch",
      serviceCategory: "website-design",
      industries: ["real-estate", "law-firms", "insurance", "fitness-gyms", "personal-trainers", "marketing-agencies", "saas", "business-consultants"],
      description: "Announce a new targeted landing page designed to capture leads",
      contentStrategy: "Launch a specific lead capture page with excitement. Focused landing pages dramatically outperform general websites for converting campaign traffic.",
      marketingObjective: "Lead Generation",
      emotionalObjective: "Excite",
      promptFramework: `Landing page launch announcement graphic for social media.

Layout: Clean focused design mimicking a landing page preview inside a laptop frame. Conversion-focused feel.

Text overlay:
- Headline: "[HEADLINE]"
- Supporting text: "[SUPPORTING_TEXT]"
- CTA button: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Laptop mockup showing landing page with clear headline and form visible
- "New" or "Live Now" badge
- Lead generation funnel icon
- [BRAND_COLORS] background gradient
- Arrow pointing to "Sign Up" or CTA area on mockup
- Clean professional layout

Business-focused. Conversion-oriented aesthetic. Professional agency style.`,
      designRules: "Landing page preview in device required. CTA prominently featured. Lead gen focus.",
      isActive: true,
    },
    {
      organizationId,
      name: "UX Improvement Reveal",
      category: "UX Improvement",
      serviceCategory: "website-design",
      industries: ["saas", "ecommerce", "medical", "dental", "restaurants", "fitness-gyms", "marketing-agencies"],
      description: "Showcase a UX redesign that makes a website easier to use and navigate",
      contentStrategy: "Show how improved user experience creates happier visitors and better business outcomes. UX is invisible when done right — make it visible.",
      marketingObjective: "Trust Building",
      emotionalObjective: "Inspire",
      promptFramework: `UX/UI improvement marketing graphic for social media.

Layout: User journey visualization with improved navigation flow shown. Clean and organized aesthetic.

Text overlay:
- Headline: "[HEADLINE]"
- Supporting text: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Website wireframe or interface showing clean navigation
- User satisfaction indicator (smile icon or rating stars)
- "Simplified" and "Optimized" labels on design elements
- Navigation flow arrows showing intuitive path
- [BRAND_COLORS] accent highlights on improved elements
- Clean modern design with light background

Human-centered design aesthetic. Clean and approachable. Professional.`,
      designRules: "Navigation or UX flow visualization. Human-centered feel. Clean minimal design.",
      isActive: true,
    },
    {
      organizationId,
      name: "Website Case Study",
      category: "Website Case Study",
      serviceCategory: "website-design",
      industries: ["real-estate", "law-firms", "medical", "fitness-gyms", "restaurants", "marketing-agencies", "saas"],
      description: "Share a client website success story with measurable business results",
      contentStrategy: "Social proof through results. A real client story with specific numbers builds trust and attracts similar businesses seeking the same outcomes.",
      marketingObjective: "Social Proof",
      emotionalObjective: "Build Trust",
      promptFramework: `Website case study success story graphic for social media.

Layout: Case study presentation style. Client logo or business name prominent. Key metrics displayed as callout stats.

Text overlay:
- Headline result: "[HEADLINE]"
- Story summary: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]" as service provider

Design elements:
- Three metric boxes: Traffic increase %, Conversion improvement %, Revenue growth $
- Website mockup thumbnail
- Client industry icon
- "Case Study" label badge in [BRAND_COLORS]
- Professional dark background with data highlights
- Trust-building layout

Results-focused. Data-driven. Premium agency presentation.`,
      designRules: "Metrics required. Client results format. Professional case study aesthetic.",
      isActive: true,
    },

    // ── WEBSITE MANAGEMENT ──────────────────────────────────
    {
      organizationId,
      name: "Website Audit Report",
      category: "Website Audit",
      serviceCategory: "website-management",
      industries: ["real-estate", "property-management", "insurance", "medical", "dental", "law-firms", "restaurants", "ecommerce"],
      description: "Present a professional website audit with findings and recommendations",
      contentStrategy: "Show the hidden technical problems most business owners don't know exist on their website. Create urgency and demonstrate expertise through a professional audit presentation.",
      marketingObjective: "Lead Generation",
      emotionalObjective: "Educate",
      promptFramework: `Website audit report marketing graphic.

Layout: Audit checklist or scorecard design. Pass/fail indicators. Professional report aesthetic.

Text overlay:
- Headline: "[HEADLINE]"
- Supporting text: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Website audit checklist with check marks and X icons
- Score display (e.g., "Your Website Score: 47/100")
- Warning indicators in amber/red for common issues
- Improvement potential in green
- Professional report header layout
- [BRAND_COLORS] accents

Technical but accessible. Urgency-creating without being alarming. Professional.`,
      designRules: "Audit checklist format. Score or grade prominently shown. Issues highlighted.",
      isActive: true,
    },
    {
      organizationId,
      name: "Website Health Check",
      category: "Website Health Check",
      serviceCategory: "website-management",
      industries: ["real-estate", "medical", "dental", "restaurants", "fitness-gyms", "ecommerce", "law-firms"],
      description: "Monthly website health report showing performance, uptime, and security status",
      contentStrategy: "Reinforce the value of ongoing maintenance through regular health check reports. Show clients that their website is actively monitored and cared for.",
      marketingObjective: "Trust Building",
      emotionalObjective: "Reassure",
      promptFramework: `Monthly website health check report graphic.

Layout: Health dashboard with vital signs metaphor. All-green status indicators. Clean monitoring aesthetic.

Text overlay:
- Headline: "[HEADLINE]"
- Supporting text: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Health status indicators: Uptime, Security, Speed, SEO (all green checkmarks)
- "All Systems Operational" or health score
- Shield icon for security
- Calendar showing "Monthly Report" timing
- [BRAND_COLORS] primary with green accent
- Clean dashboard layout

Reassuring design. All green and positive. Professional monitoring feel.`,
      designRules: "All-green health indicators. Uptime and security prominently shown. Reassuring tone.",
      isActive: true,
    },
    {
      organizationId,
      name: "Security Update Announcement",
      category: "Security Update",
      serviceCategory: "website-management",
      industries: ["ecommerce", "medical", "dental", "law-firms", "financial-advisors", "saas"],
      description: "Communicate proactive security updates that protect the website and customer data",
      contentStrategy: "Security is trust. Communicating security updates demonstrates professionalism, proactive care, and the value of ongoing website management.",
      marketingObjective: "Trust Building",
      emotionalObjective: "Reassure",
      promptFramework: `Website security update announcement graphic.

Layout: Security-focused design with shield motif. Protection theme. Professional and serious.

Text overlay:
- Headline: "[HEADLINE]"
- Supporting text: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Large shield icon with checkmark in [BRAND_COLORS]
- Lock icon and SSL badge
- "Protected" status label in green
- Security update version or date
- Dark background with blue/green security palette
- "Customer Data Protected" emphasis

Serious but reassuring. Protection-focused. Professional.`,
      designRules: "Shield and lock iconography required. Green/blue security palette. Protection messaging.",
      isActive: true,
    },
    {
      organizationId,
      name: "Monthly Maintenance Report",
      category: "Monthly Maintenance",
      serviceCategory: "website-management",
      industries: ["real-estate", "property-management", "restaurants", "medical", "dental", "law-firms", "fitness-gyms"],
      description: "Monthly recap of website maintenance tasks, updates, and improvements completed",
      contentStrategy: "Show clients exactly what they're paying for. A transparent monthly recap builds trust and demonstrates the continuous value of website management.",
      marketingObjective: "Retention",
      emotionalObjective: "Reassure",
      promptFramework: `Monthly website maintenance recap graphic.

Layout: Task completion checklist. Professional report style. Month in review format.

Text overlay:
- Headline: "[HEADLINE]"
- Supporting text: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Completed task list with green checkmarks: Plugins Updated, Security Scan, Backups, Performance Test
- Month and year label
- "All Tasks Complete" success banner
- [BRAND_COLORS] accent color
- Clean report layout with icon for each task category
- Progress or completion percentage

Professional transparency. Completed work celebration. Client value focused.`,
      designRules: "Task checklist format. Month/year labeled. Completion celebration feel.",
      isActive: true,
    },
    {
      organizationId,
      name: "Performance Optimization Result",
      category: "Performance Optimization",
      serviceCategory: "website-management",
      industries: ["ecommerce", "saas", "restaurants", "real-estate", "medical", "fitness-gyms"],
      description: "Share performance improvements from optimization work with before/after metrics",
      contentStrategy: "Show the measurable impact of technical optimization. Faster websites, higher Core Web Vitals scores, and better SEO rankings are concrete wins worth celebrating.",
      marketingObjective: "Trust Building",
      emotionalObjective: "Inspire",
      promptFramework: `Website performance optimization results graphic.

Layout: Before/after metrics comparison. Speed and performance focus. Data visualization.

Text overlay:
- Headline: "[HEADLINE]"
- Supporting text: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Before: red/amber performance score → After: green performance score (90+)
- Speed improvement comparison numbers
- Core Web Vitals pass indicators
- "Optimized" badge with lightning bolt
- [BRAND_COLORS] with green accent for "after" improvements
- Clean technical aesthetic

Performance-focused. Dramatic improvement visual. Professional metrics.`,
      designRules: "Before/after performance metrics. Score improvement visual. Green success indicators.",
      isActive: true,
    },
    {
      organizationId,
      name: "Hosting & Uptime Report",
      category: "Hosting Management",
      serviceCategory: "website-management",
      industries: ["ecommerce", "saas", "real-estate", "medical", "law-firms", "marketing-agencies"],
      description: "Highlight premium hosting, uptime statistics, and reliability of managed website infrastructure",
      contentStrategy: "Uptime is revenue. Show clients that their website is always available with 99.9% uptime. Emphasize that downtime costs businesses money and customers.",
      marketingObjective: "Trust Building",
      emotionalObjective: "Reassure",
      promptFramework: `Website hosting and uptime statistics graphic.

Layout: Uptime monitoring dashboard style. Server reliability focus.

Text overlay:
- Headline: "[HEADLINE]"
- Supporting text: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- "99.9% Uptime" large display number
- Green server status indicators
- Uptime monitoring graph (flat line = always up)
- Server location badge
- "Always Online" guarantee badge
- [BRAND_COLORS] with strong green elements
- Clean infrastructure dashboard feel

Reliable and technical. Uptime focused. Confidence-building.`,
      designRules: "99.9% uptime stat prominently shown. Server and reliability imagery. Green success.",
      isActive: true,
    },
    {
      organizationId,
      name: "Backup & Recovery Protection",
      category: "Backup & Recovery",
      serviceCategory: "website-management",
      industries: ["ecommerce", "medical", "law-firms", "saas", "real-estate", "restaurants"],
      description: "Highlight automatic daily backups and disaster recovery protection for the website",
      contentStrategy: "Backup = insurance. Most business owners don't realize their website data isn't automatically protected. Create urgency around the real risk of data loss.",
      marketingObjective: "Education",
      emotionalObjective: "Reassure",
      promptFramework: `Website backup and recovery protection graphic.

Layout: Safety and protection theme. Backup shield motif. Data security focus.

Text overlay:
- Headline: "[HEADLINE]"
- Supporting text: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Shield icon with database/server imagery
- "Daily Backups" badge
- Cloud backup visualization
- Recovery timeline: "Restore in minutes" label
- [BRAND_COLORS] with blue/teal protection palette
- Calendar icon showing daily schedule

Safety and security focused. Protection theme. Professional.`,
      designRules: "Backup/recovery iconography. Daily frequency emphasized. Protection theme.",
      isActive: true,
    },
    {
      organizationId,
      name: "Website Monitoring Alert",
      category: "Website Monitoring",
      serviceCategory: "website-management",
      industries: ["ecommerce", "saas", "real-estate", "medical", "restaurants", "law-firms"],
      description: "Show 24/7 website monitoring that catches issues before customers notice them",
      contentStrategy: "Proactive monitoring = professional management. Show clients that issues are caught and resolved before customers experience them — this is the definition of great website management.",
      marketingObjective: "Trust Building",
      emotionalObjective: "Reassure",
      promptFramework: `24/7 website monitoring service graphic.

Layout: Monitoring dashboard with real-time alerting theme. Clock emphasizing 24/7 coverage.

Text overlay:
- Headline: "[HEADLINE]"
- Supporting text: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- "24/7 Monitoring" large badge with clock icon
- Alert status: "All Systems Operational" in green
- Monitoring timeline/heartbeat line
- Notification bell icon
- Response time badge: "Issues Resolved Before You Notice"
- [BRAND_COLORS] with monitoring dashboard aesthetic

Always-on protection feel. Professional tech monitoring. Reassuring.`,
      designRules: "24/7 and clock elements required. Alert and monitoring iconography. Green status.",
      isActive: true,
    },

    // ── CONTENT MANAGEMENT ──────────────────────────────────
    {
      organizationId,
      name: "Content Calendar Preview",
      category: "Content Calendar",
      serviceCategory: "content-management",
      industries: ["real-estate", "property-management", "restaurants", "fitness-gyms", "beauty-salons", "dental", "medical", "saas", "marketing-agencies"],
      description: "Show a structured content calendar that keeps businesses organized and consistent",
      contentStrategy: "Consistency is the key to social media success. A well-planned content calendar prevents the panic of daily posting and ensures strategic, purposeful content.",
      marketingObjective: "Brand Awareness",
      emotionalObjective: "Inspire",
      promptFramework: `Content calendar planning graphic for social media.

Layout: Calendar grid design with branded content thumbnails filling each day. Organized and colorful.

Text overlay:
- Headline: "[HEADLINE]"
- Supporting text: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Weekly or monthly calendar grid
- Branded mini post thumbnails in each calendar slot
- Color-coded content types: Educational, Promotional, Engagement
- Platform icons (Facebook, Instagram) on each post
- Clean organized grid aesthetic
- [BRAND_COLORS] as primary calendar palette

Organized, strategic feel. Content planning aesthetic. Professional agency.`,
      designRules: "Calendar grid layout required. Content thumbnails in slots. Color-coded by type.",
      isActive: true,
    },
    {
      organizationId,
      name: "Weekly Content Plan",
      category: "Weekly Content Plan",
      serviceCategory: "content-management",
      industries: ["real-estate", "restaurants", "fitness-gyms", "beauty-salons", "medical", "dental", "property-management"],
      description: "Weekly content plan showing 5-7 strategic posts planned for a client",
      contentStrategy: "Show the value of planned, strategic weekly content vs. random ad hoc posting. A clear weekly plan gives businesses direction and consistent audience growth.",
      marketingObjective: "Brand Awareness",
      emotionalObjective: "Educate",
      promptFramework: `Weekly content plan graphic for social media.

Layout: 7-day week overview with content types for each day clearly labeled. Clean planning aesthetic.

Text overlay:
- Headline: "[HEADLINE]"
- Supporting text: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Mon-Sun labels with content type for each day
- Post type icons: Educational, Promotional, Behind the Scenes, etc.
- Day-of-week color coding in [BRAND_COLORS]
- "This Week's Content" header
- Platform icons

Strategic planning feel. Organized week view. Content agency aesthetic.`,
      designRules: "7-day week view. Content type labeled per day. Strategic planning aesthetic.",
      isActive: true,
    },
    {
      organizationId,
      name: "Educational Post Graphic",
      category: "Educational Post",
      serviceCategory: "content-management",
      industries: ["real-estate", "financial-advisors", "law-firms", "medical", "dental", "chiropractic", "fitness-gyms", "personal-trainers", "insurance", "mortgage"],
      description: "Educational tip or insight post that positions the business as an expert authority",
      contentStrategy: "Authority building through education. Teaching potential clients something valuable builds trust, positions the business as an expert, and keeps followers engaged.",
      marketingObjective: "Authority Building",
      emotionalObjective: "Educate",
      promptFramework: `Educational tip graphic for [BUSINESS_NAME].

Layout: Clean educational infographic style. Tip number or listicle format. Easy to read at a glance.

Text overlay:
- Large tip headline: "[HEADLINE]"
- Educational body: "[SUPPORTING_TEXT]"
- Source/authority: "[BUSINESS_NAME]"
- CTA: "[CTA]"

Design elements:
- "Did You Know?" or "Pro Tip" badge in [BRAND_COLORS]
- Numbered tip format if multiple points
- Relevant icon or illustration for the topic
- Clean white or dark background
- Strong readable typography
- Brand badge in bottom corner

Clean educational design. Authority positioning. Professional and credible.`,
      designRules: "Tip or educational format. 'Did You Know?' or Pro Tip badge. Clean readable layout.",
      isActive: true,
    },
    {
      organizationId,
      name: "Industry Insight Post",
      category: "Industry Insight",
      serviceCategory: "content-management",
      industries: ["real-estate", "financial-advisors", "law-firms", "insurance", "mortgage", "medical", "saas", "marketing-agencies", "business-consultants"],
      description: "Share a relevant industry trend, statistic, or market insight to spark conversation",
      contentStrategy: "Industry insights position businesses as informed thought leaders. Sharing market data, trends, and expert perspectives keeps followers informed and builds authority.",
      marketingObjective: "Authority Building",
      emotionalObjective: "Educate",
      promptFramework: `Industry insight data visualization graphic.

Layout: Statistic or insight callout format. Data-focused design with supporting imagery.

Text overlay:
- Insight headline or statistic: "[HEADLINE]"
- Context: "[SUPPORTING_TEXT]"
- "[BUSINESS_NAME]" as the insight source
- CTA: "[CTA]"

Design elements:
- Large statistic number prominently displayed
- Source attribution label
- Relevant industry imagery or icon
- Chart or trend indicator if applicable
- [BRAND_COLORS] background
- "Industry Insight" badge

Data-driven authority. Clean stat display. Professional credibility.`,
      designRules: "Statistic or insight prominently shown. Source attribution included. Data visualization if applicable.",
      isActive: true,
    },
    {
      organizationId,
      name: "Business Tip of the Week",
      category: "Business Tip",
      serviceCategory: "content-management",
      industries: ["marketing-agencies", "business-consultants", "saas", "financial-advisors", "real-estate", "fitness-gyms", "personal-trainers"],
      description: "Weekly actionable business tip that provides immediate value to followers",
      contentStrategy: "Consistency builds habit. A weekly tip series creates an expectation among followers and builds authority over time through consistent value delivery.",
      marketingObjective: "Community Engagement",
      emotionalObjective: "Motivate",
      promptFramework: `Weekly business tip graphic.

Layout: Bold tip presentation with clear numbered series element.

Text overlay:
- "Tip of the Week" header badge
- Tip number (if series)
- Bold headline: "[HEADLINE]"
- Tip explanation: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Bulb or star icon for "tip" concept
- Week number badge
- [BRAND_COLORS] bold background
- Strong typography hierarchy
- Business category icon
- Series branding element

Weekly series feel. Consistent branding. Actionable tip focus.`,
      designRules: "Tip series branding. Week number or series identifier. Actionable headline.",
      isActive: true,
    },
    {
      organizationId,
      name: "Customer Spotlight",
      category: "Customer Spotlight",
      serviceCategory: "content-management",
      industries: ["real-estate", "restaurants", "fitness-gyms", "beauty-salons", "spas", "dental", "medical", "chiropractic"],
      description: "Feature a happy customer or client story to build trust and social proof",
      contentStrategy: "Social proof is the most powerful form of marketing. A customer spotlight humanizes the brand, celebrates clients, and shows prospects what results they can expect.",
      marketingObjective: "Social Proof",
      emotionalObjective: "Build Trust",
      promptFramework: `Customer spotlight feature graphic.

Layout: Profile-style feature with customer photo (or avatar) and quote. Warm and celebratory design.

Text overlay:
- "Client Spotlight" or "Customer Feature" header badge
- Customer quote or result: "[HEADLINE]"
- Their story: "[SUPPORTING_TEXT]"
- "[BUSINESS_NAME]" branding

Design elements:
- Customer photo circle or avatar placeholder
- Quote marks (large decorative quotation marks)
- 5-star rating graphic
- Warm celebratory color palette using [BRAND_COLORS]
- "Success Story" badge
- Customer first name and location

Human and warm design. Success celebration. Trust-building focus.`,
      designRules: "Customer photo or avatar placeholder. Quote marks. 5-star graphic. Warm tone.",
      isActive: true,
    },
    {
      organizationId,
      name: "Content Performance Report",
      category: "Content Performance Report",
      serviceCategory: "content-management",
      industries: ["marketing-agencies", "saas", "real-estate", "restaurants", "fitness-gyms", "ecommerce"],
      description: "Monthly content performance metrics showing reach, engagement, and growth from content management",
      contentStrategy: "Show the ROI of content management through data. Reach, impressions, engagement rates, and follower growth prove that consistent content creation drives real business results.",
      marketingObjective: "Retention",
      emotionalObjective: "Build Trust",
      promptFramework: `Content performance monthly report graphic.

Layout: Analytics dashboard style with key content metrics. Clean data presentation.

Text overlay:
- "Content Report" header
- Headline metric: "[HEADLINE]"
- Summary: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Key metrics: Total Reach, Engagement Rate, Impressions, Follower Growth
- Upward trend graphs in [BRAND_COLORS]
- Month label
- Platform breakdown icons
- "vs Last Month" percentage improvements
- Clean dashboard grid layout

Data-focused. Professional reporting. Growth celebration.`,
      designRules: "Multiple metric callouts. Growth trend graphs. Monthly report format.",
      isActive: true,
    },
    {
      organizationId,
      name: "Content Strategy Highlight",
      category: "Content Strategy Highlight",
      serviceCategory: "content-management",
      industries: ["marketing-agencies", "business-consultants", "saas", "real-estate", "fitness-gyms"],
      description: "Showcase the content strategy framework that drives consistent growth for clients",
      contentStrategy: "Position the content management service as strategic, not just tactical. Show clients that there's a sophisticated system driving their content — they're not just getting random posts.",
      marketingObjective: "Authority Building",
      emotionalObjective: "Inspire",
      promptFramework: `Content strategy framework visualization graphic.

Layout: Strategy map or framework diagram. Professional consulting presentation aesthetic.

Text overlay:
- Headline: "[HEADLINE]"
- Strategy summary: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Strategy framework diagram: Pillars or pyramid structure
- Content pillars labeled (Educational, Authority, Engagement, etc.)
- Arrows showing content → audience → leads flow
- [BRAND_COLORS] strategic color coding
- "Content Strategy" title badge
- Professional consulting diagram feel

Strategic and sophisticated. Framework visualization. Authority positioning.`,
      designRules: "Strategy framework diagram. Content pillars visualization. Professional consulting aesthetic.",
      isActive: true,
    },

    // ── META ADS MANAGEMENT ─────────────────────────────────
    {
      organizationId,
      name: "Campaign Launch Announcement",
      category: "Campaign Launch",
      serviceCategory: "meta-ads",
      industries: ["real-estate", "insurance", "law-firms", "medical", "dental", "fitness-gyms", "home-services", "restaurants", "ecommerce"],
      description: "Announce the launch of a new Meta advertising campaign with excitement",
      contentStrategy: "Build excitement around a new ad campaign launch. Show what the campaign will achieve and why the investment in Meta ads drives real business results.",
      marketingObjective: "Brand Awareness",
      emotionalObjective: "Excite",
      promptFramework: `Meta Ads campaign launch announcement graphic.

Layout: Launch announcement with platform branding. Facebook and Instagram ad mockup preview.

Text overlay:
- "New Campaign Live" badge
- Headline: "[HEADLINE]"
- Campaign goal: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Facebook and Instagram logo icons
- Ad mockup preview showing campaign creative
- "LIVE" status indicator with green pulse
- Campaign objective badge: Lead Generation / Awareness / Conversions
- [BRAND_COLORS] background with Meta brand blue accents
- Launch rocket or celebration element

Exciting campaign energy. Platform-authentic. Results-anticipating.`,
      designRules: "Facebook/Instagram platform icons. Campaign objective labeled. Launch energy required.",
      isActive: true,
    },
    {
      organizationId,
      name: "Lead Generation Results",
      category: "Lead Generation Results",
      serviceCategory: "meta-ads",
      industries: ["real-estate", "insurance", "law-firms", "medical", "dental", "fitness-gyms", "home-services", "mortgage"],
      description: "Report on Meta ads lead generation campaign results with CPL and volume metrics",
      contentStrategy: "Show the direct business impact of Meta ads lead campaigns. Cost per lead, total leads, and lead quality are the metrics that matter to business owners.",
      marketingObjective: "Social Proof",
      emotionalObjective: "Inspire",
      promptFramework: `Meta Ads lead generation results graphic.

Layout: Results dashboard with lead metrics prominently displayed.

Text overlay:
- Headline result: "[HEADLINE]"
- Campaign summary: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Large "X Leads Generated" number
- Cost per lead metric display
- 30-day period label
- Facebook/Instagram icons
- Green upward trend arrow
- "Results" badge
- [BRAND_COLORS] dark dashboard with green accents
- Lead/contact icon

Results-focused. Data celebration. Professional agency metrics.`,
      designRules: "Lead count prominently shown. CPL metric displayed. Dark dashboard style with green accents.",
      isActive: true,
    },
    {
      organizationId,
      name: "ROAS Report",
      category: "ROAS Report",
      serviceCategory: "meta-ads",
      industries: ["ecommerce", "retail", "restaurants", "saas", "fitness-gyms", "beauty-salons"],
      description: "Return on ad spend (ROAS) report demonstrating revenue generated from Meta ads investment",
      contentStrategy: "ROAS is the ultimate Meta ads metric for product/revenue businesses. Show how ad spend multiplies into revenue — a 4x ROAS means $4 back for every $1 spent.",
      marketingObjective: "Social Proof",
      emotionalObjective: "Inspire",
      promptFramework: `ROAS (Return on Ad Spend) results graphic.

Layout: ROI calculation display with large ROAS multiplier featured prominently.

Text overlay:
- ROAS number headline: "[HEADLINE]"
- Context: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Large "X.X ROAS" display (e.g., "4.7x")
- Dollar in → Dollar out visualization
- Revenue returned vs. spent comparison
- "For Every $1 Spent, We Return $X" formula
- [BRAND_COLORS] financial display aesthetic
- Green dollar sign accents
- Facebook/Instagram logo integration

ROI-focused. Revenue demonstration. Financial results aesthetic.`,
      designRules: "ROAS multiplier prominently displayed. Dollar-in/out visualization. Revenue focus.",
      isActive: true,
    },
    {
      organizationId,
      name: "Cost Per Lead Report",
      category: "Cost Per Lead Report",
      serviceCategory: "meta-ads",
      industries: ["real-estate", "insurance", "law-firms", "medical", "dental", "mortgage", "home-services", "fitness-gyms"],
      description: "CPL performance report showing cost efficiency of lead generation campaigns",
      contentStrategy: "CPL is the North Star metric for lead-focused businesses. Low CPL means more leads per dollar — celebrate impressive CPL improvements over time.",
      marketingObjective: "Social Proof",
      emotionalObjective: "Build Trust",
      promptFramework: `Cost Per Lead performance report graphic.

Layout: CPL metric dashboard. Cost reduction trend visualization.

Text overlay:
- CPL headline: "[HEADLINE]"
- Campaign details: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- "Cost Per Lead: $XX" large display
- Industry average comparison: "Industry Avg: $XX vs Our Result: $XX"
- Downward cost arrow (lower CPL = better)
- Lead volume counter
- "Qualified Leads" badge
- [BRAND_COLORS] with comparison bar chart
- "This Month" period label

Efficiency-focused. Cost comparison display. Professional metrics aesthetic.`,
      designRules: "CPL prominently shown. Industry comparison if possible. Cost efficiency focus.",
      isActive: true,
    },
    {
      organizationId,
      name: "Conversion Growth Report",
      category: "Conversion Growth",
      serviceCategory: "meta-ads",
      industries: ["ecommerce", "saas", "real-estate", "fitness-gyms", "medical", "dental"],
      description: "Show conversion rate improvements from Meta ads campaign optimization",
      contentStrategy: "Conversion growth is the compound interest of advertising. Show how ongoing optimization improves results month over month and why staying invested pays off.",
      marketingObjective: "Social Proof",
      emotionalObjective: "Inspire",
      promptFramework: `Conversion growth tracking graphic.

Layout: Growth chart with conversion metrics. Upward trend visualization.

Text overlay:
- Growth headline: "[HEADLINE]"
- Comparison details: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Upward trending conversion graph (month 1 vs month 3 comparison)
- Conversion rate percentage improvement badge
- Arrow pointing up with % gain
- Month-over-month comparison bars in [BRAND_COLORS]
- "Optimized" badge
- Green growth color accents

Growth story visual. Month-over-month improvement. Optimization value shown.`,
      designRules: "Month-over-month growth chart. Conversion percentage improvement. Upward trend required.",
      isActive: true,
    },
    {
      organizationId,
      name: "Retargeting Campaign Highlight",
      category: "Retargeting Campaign",
      serviceCategory: "meta-ads",
      industries: ["ecommerce", "real-estate", "fitness-gyms", "restaurants", "dental", "saas"],
      description: "Explain the power of retargeting campaigns for re-engaging warm website visitors",
      contentStrategy: "Retargeting is the most cost-effective form of advertising. Educate on how following up with website visitors produces dramatically lower CPL and higher conversion rates.",
      marketingObjective: "Education",
      emotionalObjective: "Educate",
      promptFramework: `Retargeting campaign education graphic.

Layout: Funnel visualization showing visitor → retargeting → conversion path.

Text overlay:
- Headline: "[HEADLINE]"
- Education: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Visitor flow diagram: Website Visit → Facebook Ad Shows → Conversion
- Retargeting funnel graphic
- "Your Customers Are Already Interested" messaging
- Conversion rate comparison: Cold vs Retargeted
- [BRAND_COLORS] funnel visualization
- Facebook pixel icon

Educational funnel design. Retargeting journey visualization. Authority positioning.`,
      designRules: "Funnel visualization required. Visitor journey shown. Educational authority feel.",
      isActive: true,
    },
    {
      organizationId,
      name: "Audience Targeting Insight",
      category: "Audience Targeting Insight",
      serviceCategory: "meta-ads",
      industries: ["real-estate", "insurance", "dental", "fitness-gyms", "restaurants", "beauty-salons", "ecommerce"],
      description: "Showcase advanced audience targeting capabilities that reach the right customers",
      contentStrategy: "The power of Meta ads is precise targeting. Show how sophisticated audience targeting reaches exactly the right people — no wasted ad spend on people who can never become customers.",
      marketingObjective: "Education",
      emotionalObjective: "Educate",
      promptFramework: `Meta Ads audience targeting education graphic.

Layout: Target audience visualization. Concentric circles or demographic breakdown display.

Text overlay:
- Headline: "[HEADLINE]"
- Targeting insight: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Target/bullseye icon in [BRAND_COLORS]
- Audience segments shown: Age, Location, Interest, Behavior
- "Reaching Your Ideal Customers" label
- Facebook audience tools aesthetic
- Precision indicators
- "Zero Wasted Ad Spend" badge

Targeting precision visual. Strategic advertising feel. Authority positioning.`,
      designRules: "Target/bullseye iconography. Audience segments labeled. Precision messaging.",
      isActive: true,
    },
    {
      organizationId,
      name: "Client Ads Success Story",
      category: "Client Success Story",
      serviceCategory: "meta-ads",
      industries: ["real-estate", "law-firms", "dental", "fitness-gyms", "restaurants", "home-services"],
      description: "Showcase a client's Meta ads success story with impressive results and ROI",
      contentStrategy: "Case studies with real numbers are the ultimate sales tool for an ads agency. Show what's possible for future clients by celebrating existing client wins.",
      marketingObjective: "Social Proof",
      emotionalObjective: "Inspire",
      promptFramework: `Meta Ads client success story case study graphic.

Layout: Case study results card. Client industry + results + period displayed.

Text overlay:
- "Client Success Story" header badge
- Result headline: "[HEADLINE]"
- Brief story: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]" as agency

Design elements:
- Key metrics in large callout boxes: Leads, CPL, ROAS, Revenue
- Client industry icon/label
- Campaign period (e.g., "30-Day Results")
- "Real Client. Real Results." stamp
- [BRAND_COLORS] dark dashboard background
- Facebook/Instagram logo integration

Results celebration. Premium case study aesthetic. Social proof focus.`,
      designRules: "Multiple metric callout boxes. Industry label. 'Real Results' authenticity badge.",
      isActive: true,
    },

    // ── SEO ─────────────────────────────────────────────────
    {
      organizationId,
      name: "Keyword Ranking Growth",
      category: "Keyword Ranking Growth",
      serviceCategory: "seo",
      industries: ["real-estate", "medical", "dental", "law-firms", "home-services", "restaurants", "property-management"],
      description: "Show keyword ranking improvements with before/after positions in Google search",
      contentStrategy: "Rankings are visible, tangible proof of SEO value. Before/after position changes show clients exactly how their visibility has improved in Google search results.",
      marketingObjective: "Social Proof",
      emotionalObjective: "Inspire",
      promptFramework: `SEO keyword ranking improvement graphic.

Layout: Search result position tracker. Before/after ranking comparison.

Text overlay:
- Headline: "[HEADLINE]"
- Keywords and positions: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Google-style search result preview showing "#1" position
- Keyword list with rank movement: "Page 3 → #1" format
- Green upward arrows for rank improvements
- "Ranking Higher" badge
- [BRAND_COLORS] with Google-inspired search aesthetic
- Month/period label

SEO results visual. Ranking improvement arrows. Google aesthetic influence.`,
      designRules: "Search position movement visualization. Keywords listed with rank changes. Google-inspired aesthetic.",
      isActive: true,
    },
    {
      organizationId,
      name: "Organic Traffic Growth",
      category: "Traffic Growth",
      serviceCategory: "seo",
      industries: ["ecommerce", "real-estate", "saas", "restaurants", "medical", "dental", "law-firms"],
      description: "Report on organic search traffic growth showing month-over-month or year-over-year improvement",
      contentStrategy: "Free traffic from Google is the long game of digital marketing. Show the compounding value of organic traffic — it grows and costs nothing per click, unlike paid ads.",
      marketingObjective: "Social Proof",
      emotionalObjective: "Inspire",
      promptFramework: `Organic traffic growth report graphic.

Layout: Traffic chart with upward trend. Google Analytics-inspired visualization.

Text overlay:
- Traffic growth headline: "[HEADLINE]"
- Period comparison: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Upward trending traffic graph with shaded area
- "Organic Sessions" counter with % increase
- Year-over-year or month-over-month comparison
- Google logo/search icon
- [BRAND_COLORS] graph with green fill
- "Free Traffic" emphasis badge

Traffic growth celebration. Analytics-style display. Organic value emphasis.`,
      designRules: "Upward traffic growth chart required. Organic sessions metric. Free traffic value emphasis.",
      isActive: true,
    },
    {
      organizationId,
      name: "Local SEO Success",
      category: "Local SEO Success",
      serviceCategory: "seo",
      industries: ["real-estate", "medical", "dental", "chiropractic", "restaurants", "home-services", "roofing", "hvac", "plumbing", "electrical", "beauty-salons", "spas", "law-firms"],
      description: "Show local search ranking victories including Google Maps and local pack positions",
      contentStrategy: "Local SEO is the most valuable form of SEO for local businesses. Ranking in the Google Maps 3-pack drives direct calls and foot traffic from local buyers.",
      marketingObjective: "Social Proof",
      emotionalObjective: "Inspire",
      promptFramework: `Local SEO success graphic showing Google Maps ranking achievement.

Layout: Google Maps 3-pack mockup showing business ranked at top. Local search victory aesthetic.

Text overlay:
- Headline: "[HEADLINE]"
- Local achievement: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Google Maps interface mockup with business at top of 3-pack
- Map pin icon in [BRAND_COLORS]
- "Local SEO" badge
- "[LOCATION]" location label
- "#1 in Google Maps" achievement banner
- Star rating display

Local search domination theme. Google Maps authentic aesthetic. Location-proud.`,
      designRules: "Google Maps 3-pack mockup. Location labeled. Local dominance messaging.",
      isActive: true,
    },
    {
      organizationId,
      name: "SEO Audit Report",
      category: "SEO Audit",
      serviceCategory: "seo",
      industries: ["real-estate", "ecommerce", "saas", "medical", "dental", "law-firms", "restaurants"],
      description: "Present an SEO audit identifying technical issues and optimization opportunities",
      contentStrategy: "An SEO audit reveals hidden problems that are costing businesses visibility and customers. Create urgency by showing exactly what's broken and what it's costing them.",
      marketingObjective: "Lead Generation",
      emotionalObjective: "Educate",
      promptFramework: `SEO audit report graphic.

Layout: Technical audit checklist format. Issues and opportunities displayed.

Text overlay:
- Headline: "[HEADLINE]"
- Audit summary: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- SEO audit checklist: Technical, On-Page, Off-Page, Local
- Pass/Fail indicators for each category
- Overall score gauge (0-100)
- Opportunity callout boxes
- [BRAND_COLORS] professional report design
- "Issues Found" counter with urgency indicator

Technical authority. Audit reveal aesthetic. Urgency-creating without fear.`,
      designRules: "Audit checklist with pass/fail indicators. Overall SEO score gauge. Technical report format.",
      isActive: true,
    },
    {
      organizationId,
      name: "Search Visibility Report",
      category: "Search Visibility Report",
      serviceCategory: "seo",
      industries: ["real-estate", "medical", "dental", "law-firms", "restaurants", "home-services", "ecommerce"],
      description: "Monthly search visibility and impressions report showing brand presence in Google",
      contentStrategy: "Search visibility is the quantity of searches where a business appears. More visibility = more opportunities. Show clients how their presence in search is growing.",
      marketingObjective: "Retention",
      emotionalObjective: "Reassure",
      promptFramework: `Search visibility monthly report graphic.

Layout: Visibility metrics dashboard. Impressions and click data visualization.

Text overlay:
- Visibility headline: "[HEADLINE]"
- Monthly summary: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Search Impressions counter (large number)
- Clicks counter
- Average position trend
- Visibility growth percentage
- Google Search Console-inspired aesthetic
- [BRAND_COLORS] data visualization
- Month label

Analytics dashboard feel. Visibility metrics focus. Monthly report professional.`,
      designRules: "Impressions and clicks metrics. Monthly period labeled. Search console inspired aesthetic.",
      isActive: true,
    },
    {
      organizationId,
      name: "SEO Optimization Tip",
      category: "Optimization Tip",
      serviceCategory: "seo",
      industries: ["real-estate", "ecommerce", "saas", "restaurants", "medical", "law-firms", "marketing-agencies"],
      description: "Educational SEO tip that provides immediate value and positions the brand as an SEO expert",
      contentStrategy: "Educational SEO content builds authority and trust. Local businesses love actionable tips they can implement — and it shows expertise that makes them want to hire the agency.",
      marketingObjective: "Authority Building",
      emotionalObjective: "Educate",
      promptFramework: `SEO educational tip graphic.

Layout: Clean educational infographic. SEO tip or hack displayed clearly.

Text overlay:
- "SEO Tip" badge
- Headline tip: "[HEADLINE]"
- Explanation: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Search/magnifying glass icon in [BRAND_COLORS]
- Numbered tip format
- Before/after keyword or ranking example
- Google-inspired search bar visual
- "Try This" action call
- Clean educational layout

Educational authority. Actionable tips. SEO expertise positioning.`,
      designRules: "'SEO Tip' badge required. Search icon. Educational layout with actionable tip.",
      isActive: true,
    },
    {
      organizationId,
      name: "Google Business Profile Success",
      category: "Google Business Profile Success",
      serviceCategory: "seo",
      industries: ["real-estate", "medical", "dental", "chiropractic", "restaurants", "home-services", "beauty-salons", "spas", "law-firms", "hvac", "plumbing"],
      description: "Show Google Business Profile optimization results: more views, calls, and direction requests",
      contentStrategy: "Google Business Profile is the #1 free tool for local business visibility. Show what happens when it's properly optimized — dramatically more calls, views, and local customers.",
      marketingObjective: "Social Proof",
      emotionalObjective: "Inspire",
      promptFramework: `Google Business Profile optimization results graphic.

Layout: GBP metrics dashboard. Before/after profile optimization results.

Text overlay:
- Result headline: "[HEADLINE]"
- Profile stats: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Google Business Profile interface mockup
- Key metrics: Views, Calls, Direction Requests, Website Clicks
- "Optimized Profile" vs "Unoptimized Profile" comparison
- Google G logo integration
- [BRAND_COLORS] with Google-inspired design
- Star ratings display

Google-authentic aesthetic. Local business optimization focus. Tangible result numbers.`,
      designRules: "GBP interface mockup. Views/calls/directions metrics. Google-inspired design elements.",
      isActive: true,
    },
    {
      organizationId,
      name: "SEO Case Study",
      category: "SEO Case Study",
      serviceCategory: "seo",
      industries: ["real-estate", "medical", "dental", "law-firms", "home-services", "restaurants", "ecommerce"],
      description: "Detailed SEO case study showing full transformation from invisible to ranking",
      contentStrategy: "The ultimate social proof for SEO services. A complete before/after story with traffic, rankings, and revenue data converts more prospects than any other content type.",
      marketingObjective: "Social Proof",
      emotionalObjective: "Inspire",
      promptFramework: `SEO case study full results graphic.

Layout: Case study card with key SEO metrics. Professional results presentation.

Text overlay:
- "SEO Case Study" header
- Result headline: "[HEADLINE]"
- Story summary: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]" as agency

Design elements:
- Three metric callout boxes: Keyword Rankings, Traffic Growth %, Lead Increase %
- Industry type label
- Timeline badge (e.g., "6-Month Results")
- Before/after ranking comparison
- [BRAND_COLORS] dark professional case study design
- Google search imagery

Premium case study aesthetic. Multiple metrics. Transformation story focus.`,
      designRules: "Multiple metric boxes. Industry and timeline labeled. Premium case study design.",
      isActive: true,
    },

    // ── SOCIAL MEDIA MANAGEMENT ─────────────────────────────
    {
      organizationId,
      name: "Follower Growth Report",
      category: "Follower Growth",
      serviceCategory: "social-media",
      industries: ["real-estate", "restaurants", "fitness-gyms", "beauty-salons", "dental", "medical", "personal-trainers", "ecommerce"],
      description: "Monthly follower growth report showing new followers gained through social media management",
      contentStrategy: "Follower growth is the most visible metric of social media success. Celebrate milestones and show month-over-month progress to demonstrate the value of professional management.",
      marketingObjective: "Social Proof",
      emotionalObjective: "Inspire",
      promptFramework: `Social media follower growth report graphic.

Layout: Growth milestone celebration. Follower count with trend chart.

Text overlay:
- Follower milestone or growth: "[HEADLINE]"
- Growth summary: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Large follower count number
- Growth percentage badge: "+X% this month"
- Instagram/Facebook platform icons
- Upward trend graph in [BRAND_COLORS]
- Celebration or milestone achievement element
- Month label

Milestone celebration energy. Platform-authentic icons. Growth visualization.`,
      designRules: "Large follower count display. Platform icons. Growth percentage badge. Celebration feel.",
      isActive: true,
    },
    {
      organizationId,
      name: "Monthly Engagement Report",
      category: "Engagement Report",
      serviceCategory: "social-media",
      industries: ["restaurants", "fitness-gyms", "beauty-salons", "real-estate", "dental", "retail", "personal-trainers"],
      description: "Monthly social media engagement report with likes, comments, shares, and reach metrics",
      contentStrategy: "Engagement rate is the quality metric for social media. High engagement means the audience cares — show clients that their followers are active, interested customers.",
      marketingObjective: "Retention",
      emotionalObjective: "Reassure",
      promptFramework: `Monthly social media engagement report graphic.

Layout: Engagement metrics dashboard. Multiple KPIs displayed in clean grid.

Text overlay:
- Headline metric: "[HEADLINE]"
- Monthly summary: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Engagement metrics grid: Likes, Comments, Shares, Saves, Reach, Impressions
- Engagement rate percentage prominently shown
- Platform breakdown (Facebook vs Instagram)
- Month label
- [BRAND_COLORS] metrics dashboard
- Up trend indicators in green

Analytics dashboard. Multiple metrics. Monthly professional report.`,
      designRules: "Multiple engagement metric callouts. Engagement rate prominently shown. Platform breakdown.",
      isActive: true,
    },
    {
      organizationId,
      name: "Content Showcase",
      category: "Content Showcase",
      serviceCategory: "social-media",
      industries: ["restaurants", "beauty-salons", "spas", "fitness-gyms", "dental", "retail", "ecommerce", "real-estate"],
      description: "Showcase a portfolio of social media content created this month for the client",
      contentStrategy: "Showing the variety and quality of content created builds confidence in the social media management service. Visual portfolio displays prove professional content output.",
      marketingObjective: "Brand Awareness",
      emotionalObjective: "Inspire",
      promptFramework: `Social media content portfolio showcase graphic.

Layout: Content grid portfolio. Multiple post thumbnails displayed in Instagram-grid style.

Text overlay:
- "This Month's Content" header
- Headline: "[HEADLINE]"
- Content summary: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- 6-9 mini post thumbnail previews in grid layout
- Varied content types visible: photo posts, graphics, carousels
- "Posts Created This Month" counter badge
- [BRAND_COLORS] frame and grid design
- Portfolio presentation aesthetic
- Platform icon watermarks

Portfolio showcase. Content variety visible. Agency quality demonstration.`,
      designRules: "Content grid with 6-9 thumbnails. Variety of post types visible. Portfolio aesthetic.",
      isActive: true,
    },
    {
      organizationId,
      name: "Community Spotlight",
      category: "Community Spotlight",
      serviceCategory: "social-media",
      industries: ["restaurants", "fitness-gyms", "beauty-salons", "dental", "real-estate", "retail", "cafes"],
      description: "Feature a community member, customer win, or local connection to build engagement",
      contentStrategy: "Community content drives the highest organic engagement. Featuring customers, local connections, and community wins makes followers feel seen and valued.",
      marketingObjective: "Community Engagement",
      emotionalObjective: "Build Trust",
      promptFramework: `Community spotlight feature graphic.

Layout: Feature presentation style. Warm community connection feel.

Text overlay:
- "Community Spotlight" header badge
- Feature headline: "[HEADLINE]"
- Community story: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Community person photo placeholder (circle crop)
- Warm neighborhood or local business background
- Heart/community icons
- [LOCATION] location label
- [BRAND_COLORS] warm accent palette
- "Part of Our Community" tagline

Warm human connection. Local community pride. Authentic feel.`,
      designRules: "Person photo placeholder. Warm community tone. Local location labeled. Heart/community iconography.",
      isActive: true,
    },
    {
      organizationId,
      name: "Social Media Tip",
      category: "Social Media Tip",
      serviceCategory: "social-media",
      industries: ["marketing-agencies", "business-consultants", "saas", "real-estate", "fitness-gyms", "restaurants"],
      description: "Educational social media tip that builds authority and provides value to business owner audiences",
      contentStrategy: "Educational social media tips position the agency as the expert. Business owners follow agencies that teach them — this builds the trust needed to hire.",
      marketingObjective: "Authority Building",
      emotionalObjective: "Educate",
      promptFramework: `Social media educational tip graphic.

Layout: Bold tip presentation. Actionable and shareable format.

Text overlay:
- "Social Media Tip" badge
- Tip headline: "[HEADLINE]"
- Tip explanation: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Phone or social platform icon
- Numbered tip or series badge
- Platform logo (Instagram/Facebook) as design element
- [BRAND_COLORS] bold background
- "Try This" action arrow
- Clean educational layout

Educational authority. Actionable tip format. Shareable design.`,
      designRules: "'Social Media Tip' badge. Platform icons. Educational tip format with action item.",
      isActive: true,
    },
    {
      organizationId,
      name: "Trending Topic Reaction",
      category: "Trending Topic",
      serviceCategory: "social-media",
      industries: ["restaurants", "retail", "fitness-gyms", "beauty-salons", "real-estate", "cafes"],
      description: "Timely post connecting the business to a trending topic, hashtag, or seasonal moment",
      contentStrategy: "Trending content gets organic reach. Connecting a local business to current trends or seasonal moments generates awareness beyond their usual audience.",
      marketingObjective: "Community Engagement",
      emotionalObjective: "Entertain",
      promptFramework: `Trending topic connection graphic for [BUSINESS_NAME].

Layout: Timely, current-feeling design. Trend awareness aesthetic.

Text overlay:
- "This Week" or trend hook: "[HEADLINE]"
- Trend connection: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Trending hashtag (#) icon
- Fire emoji or trend indicator element
- Timely seasonal or cultural reference visual
- [BRAND_COLORS] energetic palette
- "Everyone's Talking About..." setup
- Business connection bridge visual

Timely and energetic. Trend-connected. Organic reach focus.`,
      designRules: "Trending indicator elements. Timely seasonal or cultural visual. Energetic design.",
      isActive: true,
    },
    {
      organizationId,
      name: "Brand Awareness Update",
      category: "Brand Awareness Update",
      serviceCategory: "social-media",
      industries: ["real-estate", "restaurants", "fitness-gyms", "beauty-salons", "dental", "saas", "marketing-agencies"],
      description: "Brand visibility post that reinforces brand identity and keeps the business top of mind",
      contentStrategy: "Brand consistency builds familiarity, and familiarity builds trust. Regular brand awareness posts keep the business in the audience's mind so they remember it when they need the service.",
      marketingObjective: "Brand Awareness",
      emotionalObjective: "Inspire",
      promptFramework: `Brand awareness update graphic for [BUSINESS_NAME].

Layout: Premium brand presentation. Business identity showcased beautifully.

Text overlay:
- Brand headline: "[HEADLINE]"
- Brand story/message: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Business name as hero typography
- [BRAND_COLORS] as full background treatment
- Brand element: logo space, color swatches visible
- Location or service area label
- "Serving [LOCATION]" with map pin
- Premium brand identity aesthetic

Premium brand feel. Identity-forward. Memorable and on-brand.`,
      designRules: "Business name as hero. Full brand color treatment. Premium brand identity aesthetic.",
      isActive: true,
    },
    {
      organizationId,
      name: "Monthly Growth Report",
      category: "Monthly Growth Report",
      serviceCategory: "social-media",
      industries: ["real-estate", "restaurants", "fitness-gyms", "beauty-salons", "dental", "marketing-agencies"],
      description: "Comprehensive monthly social media growth report across all platforms and metrics",
      contentStrategy: "A monthly growth report is the definitive proof of social media management value. Combine all metrics — followers, reach, engagement, content output — into one impressive summary.",
      marketingObjective: "Retention",
      emotionalObjective: "Build Trust",
      promptFramework: `Monthly social media growth summary report graphic.

Layout: Comprehensive dashboard. Multiple platform metrics in one display.

Text overlay:
- "Monthly Report" header
- Growth headline: "[HEADLINE]"
- Summary: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Platform logos: Facebook, Instagram side by side
- Key metrics grid: Followers, Reach, Engagement, Posts, Impressions
- Month-over-month comparison bars
- "vs Last Month" percentage improvements
- [BRAND_COLORS] professional dashboard design
- Month/year label

Comprehensive monthly report. Professional analytics dashboard. Value demonstration.`,
      designRules: "Multi-platform metrics. Month/year labeled. Comprehensive dashboard style.",
      isActive: true,
    },

    // ── LEAD GENERATION ─────────────────────────────────────
    {
      organizationId,
      name: "New Leads Announcement",
      category: "New Leads Generated",
      serviceCategory: "lead-generation",
      industries: ["real-estate", "insurance", "law-firms", "medical", "dental", "mortgage", "home-services", "fitness-gyms"],
      description: "Celebrate a lead generation milestone with impressive lead count and cost metrics",
      contentStrategy: "Lead results are the most compelling proof of marketing ROI for service businesses. A strong lead count with low CPL shows prospects exactly what ROI they can expect.",
      marketingObjective: "Social Proof",
      emotionalObjective: "Inspire",
      promptFramework: `Lead generation results announcement graphic.

Layout: Bold results announcement. Large lead numbers prominently featured.

Text overlay:
- Lead milestone headline: "[HEADLINE]"
- Campaign details: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Large lead count number (e.g., "47 NEW LEADS")
- Period badge: "This Month" or "30 Days"
- Dollar per lead metric
- Contact/person icon showing leads as people
- Green success color palette with [BRAND_COLORS]
- Upward arrow trend indicator

Results celebration. Bold lead count. Cost efficiency emphasis.`,
      designRules: "Large lead count prominent. Period and CPL shown. Bold celebration design.",
      isActive: true,
    },
    {
      organizationId,
      name: "Appointment Booking Results",
      category: "Appointment Bookings",
      serviceCategory: "lead-generation",
      industries: ["medical", "dental", "chiropractic", "law-firms", "financial-advisors", "fitness-gyms", "beauty-salons", "spas"],
      description: "Show appointment booking volume generated through lead generation campaigns",
      contentStrategy: "Appointments booked are the clearest indicator of lead generation success for service businesses. More appointments = more revenue, plain and simple.",
      marketingObjective: "Social Proof",
      emotionalObjective: "Inspire",
      promptFramework: `Appointment booking results graphic.

Layout: Calendar and appointment visualization. Booking volume prominent.

Text overlay:
- Appointment headline: "[HEADLINE]"
- Campaign results: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Calendar icon with checkmarks showing bookings filled
- "X Appointments Booked" large number
- Calendar grid with marked booking slots
- [BRAND_COLORS] with calendar/appointment aesthetic
- "Booked & Confirmed" badge
- Period label

Calendar booking visual. Appointment success theme. Service business focus.`,
      designRules: "Calendar imagery with bookings. Appointment count prominent. 'Booked & Confirmed' badge.",
      isActive: true,
    },
    {
      organizationId,
      name: "Conversion Rate Improvement",
      category: "Conversion Improvement",
      serviceCategory: "lead-generation",
      industries: ["real-estate", "insurance", "law-firms", "medical", "dental", "fitness-gyms", "ecommerce"],
      description: "Report on conversion rate improvements from funnel optimization and lead nurturing",
      contentStrategy: "Conversion rate optimization shows that the system is getting smarter, not just bigger. More leads from the same traffic means growing ROI without growing spend.",
      marketingObjective: "Social Proof",
      emotionalObjective: "Build Trust",
      promptFramework: `Conversion rate improvement results graphic.

Layout: Funnel improvement visualization with before/after conversion rates.

Text overlay:
- Conversion headline: "[HEADLINE]"
- Funnel improvement: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Conversion funnel diagram showing improved flow
- Before %: → After % comparison
- "Better Results, Same Budget" messaging
- Upward conversion arrow
- [BRAND_COLORS] funnel visualization
- ROI improvement badge

Funnel improvement visualization. Cost efficiency story. ROI focus.`,
      designRules: "Conversion funnel diagram. Before/after percentage comparison. ROI and efficiency focus.",
      isActive: true,
    },
    {
      organizationId,
      name: "Sales Funnel Insight",
      category: "Funnel Insight",
      serviceCategory: "lead-generation",
      industries: ["real-estate", "insurance", "law-firms", "financial-advisors", "saas", "marketing-agencies", "business-consultants"],
      description: "Educate on the sales funnel framework and how leads move from awareness to client",
      contentStrategy: "Teaching the lead generation funnel builds authority and helps prospects understand why they need a strategic approach vs. random marketing tactics.",
      marketingObjective: "Education",
      emotionalObjective: "Educate",
      promptFramework: `Sales funnel education graphic.

Layout: Classic funnel diagram with stages labeled. Educational and strategic.

Text overlay:
- Headline: "[HEADLINE]"
- Funnel explanation: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Classic sales funnel: Awareness → Interest → Consideration → Decision → Client
- Each stage with icon and brief label
- Lead count reduction showing qualification
- [BRAND_COLORS] gradient funnel
- Educational infographic style
- "Your Marketing Blueprint" label

Educational authority. Strategic funnel visualization. Professional consulting feel.`,
      designRules: "Sales funnel stages labeled. Educational infographic style. Strategic consulting aesthetic.",
      isActive: true,
    },
    {
      organizationId,
      name: "Client Acquisition Success",
      category: "Client Acquisition Success",
      serviceCategory: "lead-generation",
      industries: ["real-estate", "law-firms", "insurance", "medical", "dental", "fitness-gyms", "business-consultants"],
      description: "Case study of a client acquisition success story from lead to signed client",
      contentStrategy: "The complete lead-to-client story is the most powerful social proof. From first ad click to signed contract — show the full journey and the revenue impact.",
      marketingObjective: "Social Proof",
      emotionalObjective: "Inspire",
      promptFramework: `Client acquisition success story graphic.

Layout: Journey visualization from lead to client. Success story celebration.

Text overlay:
- "Client Acquired" achievement headline: "[HEADLINE]"
- Story summary: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Journey timeline: Ad Clicked → Lead Captured → Appointment → Signed Client
- Revenue or deal value badge (optional)
- "Success Story" header
- Handshake or contract signing icon
- [BRAND_COLORS] success palette with green
- "Real Results" authenticity stamp

Success journey visualization. Revenue achievement focus. Authentic case study.`,
      designRules: "Lead-to-client journey shown. Revenue value if applicable. 'Real Results' authenticity.",
      isActive: true,
    },
    {
      organizationId,
      name: "Qualified Lead Report",
      category: "Qualified Lead Report",
      serviceCategory: "lead-generation",
      industries: ["real-estate", "law-firms", "insurance", "financial-advisors", "medical", "dental"],
      description: "Report on qualified lead quality and conversion-ready prospects generated this period",
      contentStrategy: "Quality over quantity. Show clients that the leads they're getting are pre-qualified, ready to buy, and worth far more than mass unqualified leads from other sources.",
      marketingObjective: "Social Proof",
      emotionalObjective: "Reassure",
      promptFramework: `Qualified lead report graphic.

Layout: Lead quality dashboard. Qualification metrics and buyer-ready indicators.

Text overlay:
- Headline: "[HEADLINE]"
- Lead quality details: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Lead quality tier visualization: Qualified vs Unqualified comparison
- Qualification criteria checklist
- "Ready to Buy" badge
- Conversion rate from lead to appointment
- [BRAND_COLORS] professional metrics display
- Checkmark quality indicators

Lead quality focus. Qualification criteria visible. Buyer-readiness emphasis.`,
      designRules: "Lead quality visualization. Qualification checklist. Quality vs quantity messaging.",
      isActive: true,
    },
    {
      organizationId,
      name: "Sales Pipeline Growth",
      category: "Sales Pipeline Growth",
      serviceCategory: "lead-generation",
      industries: ["real-estate", "insurance", "law-firms", "financial-advisors", "saas", "business-consultants"],
      description: "Show how lead generation has grown the sales pipeline with total pipeline value",
      contentStrategy: "Pipeline value is a business metric every owner understands. Show not just lead count but the potential revenue sitting in the pipeline from lead generation.",
      marketingObjective: "Social Proof",
      emotionalObjective: "Inspire",
      promptFramework: `Sales pipeline growth graphic.

Layout: Pipeline visualization with revenue value stages. Business growth focus.

Text overlay:
- Pipeline headline: "[HEADLINE]"
- Pipeline details: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Pipeline stages: New Lead → Contacted → Qualified → Proposal → Won
- Pipeline value at each stage
- Total pipeline value displayed large
- Revenue growth arrow
- [BRAND_COLORS] pipeline flow visualization
- "$" dollar sign prominence

Revenue pipeline focus. Business growth visualization. Deal stage breakdown.`,
      designRules: "Pipeline stages with revenue values. Total pipeline value prominent. Revenue growth focus.",
      isActive: true,
    },
    {
      organizationId,
      name: "Lead Source Analysis",
      category: "Lead Source Analysis",
      serviceCategory: "lead-generation",
      industries: ["real-estate", "insurance", "medical", "dental", "fitness-gyms", "ecommerce", "marketing-agencies"],
      description: "Breakdown of where leads are coming from across all channels and marketing activities",
      contentStrategy: "Lead attribution shows clients where their marketing dollars are working hardest. A clear source breakdown helps optimize budget allocation toward highest-performing channels.",
      marketingObjective: "Education",
      emotionalObjective: "Educate",
      promptFramework: `Lead source attribution analysis graphic.

Layout: Pie chart or bar chart showing lead source breakdown. Channel performance comparison.

Text overlay:
- Analysis headline: "[HEADLINE]"
- Source breakdown summary: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Lead source pie chart: Meta Ads, SEO, Google Ads, Organic, Referral percentages
- Channel performance bar comparison
- "Top Performing Channel" winner badge
- [BRAND_COLORS] chart palette
- Percentage labels on each source
- "Where Your Leads Come From" title

Channel attribution visualization. Pie chart or bar chart. Marketing intelligence aesthetic.`,
      designRules: "Lead source breakdown chart. Channel percentages labeled. Top performer highlighted.",
      isActive: true,
    },

    // ── BRANDING ─────────────────────────────────────────────
    {
      organizationId,
      name: "Logo Reveal",
      category: "Logo Reveal",
      serviceCategory: "branding",
      industries: ["real-estate", "restaurants", "cafes", "fitness-gyms", "beauty-salons", "spas", "retail", "medical", "dental", "law-firms", "marketing-agencies"],
      description: "Dramatic logo reveal for a new brand or refreshed logo design",
      contentStrategy: "A logo reveal is a moment to celebrate. Build excitement around the new brand identity and invite the audience to experience the rebirth of the business brand.",
      marketingObjective: "Brand Awareness",
      emotionalObjective: "Excite",
      promptFramework: `Brand logo reveal announcement graphic.

Layout: Dramatic reveal with logo as the hero element. Premium brand presentation.

Text overlay:
- "Meet Our New Logo" or brand announcement: "[HEADLINE]"
- Brand story: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Logo displayed large and prominently centered
- Spotlight or reveal effect (gradient background drawing focus to logo)
- "New Look" or "Introducing" badge
- [BRAND_COLORS] as full background
- Confetti or celebration subtle elements
- Professional brand reveal aesthetic

Dramatic reveal energy. Logo as hero. Premium brand announcement feel.`,
      designRules: "Logo as absolute hero element. Dramatic reveal lighting/gradient. Brand celebration energy.",
      isActive: true,
    },
    {
      organizationId,
      name: "Brand Refresh Announcement",
      category: "Brand Refresh",
      serviceCategory: "branding",
      industries: ["real-estate", "restaurants", "fitness-gyms", "beauty-salons", "spas", "medical", "dental", "marketing-agencies"],
      description: "Announce a brand refresh with before/after comparison of old vs new brand identity",
      contentStrategy: "A brand refresh is about evolution, not starting over. Show the visual transformation and explain the strategic thinking behind the new direction.",
      marketingObjective: "Brand Awareness",
      emotionalObjective: "Inspire",
      promptFramework: `Brand refresh before/after comparison graphic.

Layout: Split design showing old brand elements left, new refreshed brand right.

Text overlay:
- "Brand Refresh" header
- Transformation headline: "[HEADLINE]"
- Evolution story: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- "Before" (old, dated brand) vs "After" (new, refined brand) split
- Arrow or transformation symbol between panels
- Color palette change visible
- Typography evolution shown
- "Evolved. Elevated. Refreshed." tagline
- [BRAND_COLORS] as "new" brand showcase

Transformation story. Before/after comparison. Brand evolution narrative.`,
      designRules: "Before/after split comparison. 'Before' deliberately dated, 'After' premium. Transformation story.",
      isActive: true,
    },
    {
      organizationId,
      name: "Brand Guidelines Preview",
      category: "Brand Guidelines",
      serviceCategory: "branding",
      industries: ["saas", "marketing-agencies", "business-consultants", "real-estate", "fitness-gyms", "restaurants"],
      description: "Preview of comprehensive brand guidelines that ensure consistent brand representation",
      contentStrategy: "Brand guidelines are the rulebook for consistent identity. Show clients and prospects the level of professionalism that comes with proper brand documentation.",
      marketingObjective: "Trust Building",
      emotionalObjective: "Inspire",
      promptFramework: `Brand guidelines document preview graphic.

Layout: Brand guide page spread with design system elements displayed.

Text overlay:
- "Brand Guidelines" header
- Headline: "[HEADLINE]"
- Guide summary: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Brand guidebook or document mockup (pages/spread)
- Design system elements visible: logo, colors, typography, patterns
- "Primary Color", "Secondary Color" labels
- Typography specimens showing font names
- [BRAND_COLORS] as the guide's own design system
- "Professional Brand Identity" badge

Design document aesthetic. System and order. Professional brand agency presentation.`,
      designRules: "Brand guidebook document mockup. Design system elements visible (logo, colors, type). System organization shown.",
      isActive: true,
    },
    {
      organizationId,
      name: "Color Palette Showcase",
      category: "Color Palette Showcase",
      serviceCategory: "branding",
      industries: ["restaurants", "beauty-salons", "spas", "cafes", "retail", "fitness-gyms", "marketing-agencies", "saas"],
      description: "Display the brand color palette in a visually striking, shareable design",
      contentStrategy: "Color is the most immediately recognizable brand element. A beautiful color palette post builds brand identity awareness and shows the strategic thinking behind the visual choices.",
      marketingObjective: "Brand Awareness",
      emotionalObjective: "Inspire",
      promptFramework: `Brand color palette showcase graphic.

Layout: Color swatch display with hex codes and color names. Beautiful and systematic.

Text overlay:
- "Brand Color Palette" header
- Headline: "[HEADLINE]"
- Color philosophy: "[SUPPORTING_TEXT]"
- "[BUSINESS_NAME]"

Design elements:
- Large color swatches for each brand color
- Hex code labels under each swatch
- Color names (e.g., "Midnight Navy #1A2B4C")
- Primary, Secondary, Accent groupings
- [BRAND_COLORS] as the swatches themselves
- Clean white or dark background
- "The Colors of [BUSINESS_NAME]" label

Clean color display. Systematic and beautiful. Brand identity focused.`,
      designRules: "Large color swatches with hex codes. Color names labeled. Primary/secondary/accent grouping.",
      isActive: true,
    },
    {
      organizationId,
      name: "Visual Identity Launch",
      category: "Visual Identity Launch",
      serviceCategory: "branding",
      industries: ["marketing-agencies", "saas", "restaurants", "fitness-gyms", "beauty-salons", "real-estate", "business-consultants"],
      description: "Full visual identity system launch showing logo, colors, typography, and brand elements",
      contentStrategy: "A full visual identity launch is the culmination of a branding project. Show the complete system working together to create a cohesive, professional brand identity.",
      marketingObjective: "Brand Awareness",
      emotionalObjective: "Excite",
      promptFramework: `Full visual identity system launch graphic.

Layout: Brand board layout showing complete identity system all together.

Text overlay:
- "New Visual Identity" announcement: "[HEADLINE]"
- Identity description: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Brand board: Logo (multiple versions), Color palette, Typography, Pattern/texture, Mock applications
- All elements arranged in elegant grid layout
- "Visual Identity System" label
- [BRAND_COLORS] as the actual system colors
- Clean professional background
- Premium design agency presentation

Comprehensive brand board. All design elements displayed. Premium launch energy.`,
      designRules: "Complete brand board layout. Logo, colors, typography, patterns all visible. Premium presentation.",
      isActive: true,
    },
    {
      organizationId,
      name: "Mission & Values Post",
      category: "Mission & Values",
      serviceCategory: "branding",
      industries: ["real-estate", "medical", "dental", "law-firms", "fitness-gyms", "restaurants", "marketing-agencies", "business-consultants"],
      description: "Brand values and mission statement post that humanizes the business and attracts aligned clients",
      contentStrategy: "Clients hire businesses they believe in, not just businesses that are convenient. A compelling mission and values post attracts clients who resonate with the brand at a deeper level.",
      marketingObjective: "Brand Awareness",
      emotionalObjective: "Inspire",
      promptFramework: `Mission and values brand post.

Layout: Values statement presentation with elegant typography focus.

Text overlay:
- Mission statement: "[HEADLINE]"
- Values expansion: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- "Our Mission" or "What We Believe" header
- Values listed with icons: [Value 1] [Value 2] [Value 3]
- [BRAND_COLORS] as background treatment
- Premium typography with mission statement as hero text
- Subtle inspirational background imagery
- Business name in prominent but refined treatment

Inspirational typography focus. Values prominently listed. Brand humanity focus.`,
      designRules: "Mission statement as hero text. Values listed with icons. Brand colors as background. Inspirational feel.",
      isActive: true,
    },
    {
      organizationId,
      name: "Company Story Post",
      category: "Company Story",
      serviceCategory: "branding",
      industries: ["real-estate", "restaurants", "fitness-gyms", "beauty-salons", "law-firms", "medical", "business-consultants", "marketing-agencies"],
      description: "Share the founding story and journey of the business to build authentic brand connection",
      contentStrategy: "Origin stories build emotional connection. Sharing the 'why' behind the business creates authenticity that manufactured marketing can never achieve. People buy from people they trust.",
      marketingObjective: "Brand Awareness",
      emotionalObjective: "Build Trust",
      promptFramework: `Company founding story brand post.

Layout: Story narrative design with founder/origin imagery and timeline element.

Text overlay:
- "Our Story" header
- Origin headline: "[HEADLINE]"
- Story excerpt: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]"

Design elements:
- Founding year badge or timeline element
- Founder photo placeholder or business origin imagery
- "Est. [Year]" heritage label
- [BRAND_COLORS] with warm storytelling palette
- Quote marks for founder quote style
- "Our Journey" or "How It Started" subheader

Origin story aesthetic. Heritage and authenticity. Warm human connection.`,
      designRules: "Founding year or timeline. Founder photo placeholder. Warm storytelling aesthetic. Heritage feel.",
      isActive: true,
    },
    {
      organizationId,
      name: "Branding Case Study",
      category: "Brand Case Study",
      serviceCategory: "branding",
      industries: ["marketing-agencies", "saas", "real-estate", "restaurants", "fitness-gyms", "beauty-salons"],
      description: "Showcase a complete branding project transformation with before/after results",
      contentStrategy: "Branding case studies are portfolio proof. Show a complete before/after transformation to demonstrate what professional branding does for a business — from forgettable to unforgettable.",
      marketingObjective: "Social Proof",
      emotionalObjective: "Inspire",
      promptFramework: `Branding transformation case study graphic.

Layout: Before/after branding comparison. Complete transformation reveal.

Text overlay:
- "Brand Transformation" case study header
- Result headline: "[HEADLINE]"
- Transformation story: "[SUPPORTING_TEXT]"
- CTA: "[CTA]"
- "[BUSINESS_NAME]" as branding agency

Design elements:
- Split layout: Old generic brand (left) → Transformed premium brand (right)
- Before: Plain, inconsistent, forgettable
- After: Polished, cohesive, premium in [BRAND_COLORS]
- "Case Study" badge
- Client industry label
- Transformation results badge

Complete brand transformation story. Before/after comparison dramatic. Premium agency portfolio.`,
      designRules: "Before/after brand comparison. Dramatic transformation visible. Before=generic, After=premium. Case study badge.",
      isActive: true,
    },
  ];
}

// ─────────────────────────────────────────────────────────────
// MAIN SEED FUNCTION
// ─────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding AutoSocial AI Template System...\n");

  // 1. Seed Industries (upsert by slug)
  console.log("📍 Seeding industries...");
  for (const industry of industries) {
    await db.industry.upsert({
      where: { slug: industry.slug },
      update: {
        name: industry.name,
        description: industry.description,
        keywords: industry.keywords,
        tone: industry.tone,
        visualStyle: industry.visualStyle,
        suggestedCtaTypes: industry.suggestedCtaTypes,
        compatibleCategories: industry.compatibleCategories,
        sortOrder: industry.sortOrder,
      },
      create: industry,
    });
  }
  console.log(`   ✅ ${industries.length} industries seeded\n`);

  // 2. Seed Service Categories (upsert by slug)
  console.log("🗂️  Seeding service categories...");
  for (const cat of serviceCategories) {
    await db.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        contentStrategy: cat.contentStrategy,
        designRules: cat.designRules,
        aiPromptFramework: cat.aiPromptFramework,
        sortOrder: cat.sortOrder,
      },
      create: cat,
    });
  }
  console.log(`   ✅ ${serviceCategories.length} service categories seeded\n`);

  // 3. Seed Templates for the first organization found
  console.log("📋 Seeding templates...");
  const org = await db.organization.findFirst({ orderBy: { createdAt: "asc" } });

  if (!org) {
    console.log("   ⚠️  No organization found — skipping template seed. Create an account first and re-run.\n");
  } else {
    console.log(`   Using organization: ${org.name} (${org.id})`);
    const templates = makeTemplates(org.id);
    let created = 0;
    let skipped = 0;

    for (const template of templates) {
      const existing = await db.creativeTemplate.findFirst({
        where: { organizationId: org.id, name: template.name, serviceCategory: template.serviceCategory },
      });
      if (existing) {
        skipped++;
      } else {
        await db.creativeTemplate.create({ data: template });
        created++;
      }
    }
    console.log(`   ✅ ${created} templates created, ${skipped} already existed\n`);
  }

  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — AutoSocial AI",
  description: "How AutoSocial AI collects, uses, and protects your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#06090f] text-slate-300">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-10">Last updated: June 18, 2026</p>

        <div className="space-y-10 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Overview</h2>
            <p>
              AutoSocial AI (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) provides a software platform that helps
              agencies and businesses generate, review, schedule, and publish social media
              content on behalf of their clients. This Privacy Policy explains what
              information we collect, how we use it, and the choices you have.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-slate-200">Account information:</strong> name, email
                address, and password (managed securely via our authentication provider).
              </li>
              <li>
                <strong className="text-slate-200">Client/business information:</strong> business
                names, descriptions, target audience, brand assets, and other details you enter
                to generate content on behalf of your clients.
              </li>
              <li>
                <strong className="text-slate-200">Connected social account data:</strong> when you
                connect a Facebook Page or Instagram Business account, we receive and store an
                access token issued by Meta, the Page/account ID, and the display name of the
                connected account.
              </li>
              <li>
                <strong className="text-slate-200">Generated content:</strong> captions, images,
                and metadata produced by our AI systems for review and publishing.
              </li>
              <li>
                <strong className="text-slate-200">Usage data:</strong> log data such as IP
                address, browser type, and pages visited, used for security and product
                improvement.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. How We Use Facebook & Instagram Platform Data</h2>
            <p className="mb-2">
              When you connect a Facebook Page or Instagram Business account, we use the
              permissions you grant solely to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Read the list of Pages and Instagram Business accounts you manage.</li>
              <li>Publish posts, images, and captions that you have reviewed and approved.</li>
              <li>Read basic engagement metrics for the content we publish on your behalf.</li>
            </ul>
            <p className="mt-2">
              We do not sell Platform Data obtained from Meta, and we do not use it for
              advertising or share it with third parties except as required to provide the
              publishing service itself (e.g., sending a post to Meta&apos;s API).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To generate social media content using AI models on your behalf.</li>
              <li>To publish approved content to the social accounts you connect.</li>
              <li>To operate, maintain, and improve the platform.</li>
              <li>To process billing and subscription payments.</li>
              <li>To communicate with you about your account or our services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Third-Party Services</h2>
            <p className="mb-2">We rely on the following third-party services to operate AutoSocial AI:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Meta Graph API — to publish content to Facebook Pages and Instagram Business accounts.</li>
              <li>AI providers (Anthropic, OpenAI) — to generate captions and images.</li>
              <li>Stripe — to process subscription payments.</li>
              <li>Cloud hosting and database providers — to run the application and store data securely.</li>
            </ul>
            <p className="mt-2">
              Each of these providers processes data under their own privacy and security
              practices, and we only share the minimum data necessary for them to perform
              their function.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Data Security & Retention</h2>
            <p>
              Access tokens for connected social accounts are encrypted at rest using
              industry-standard AES-256 encryption before being stored. We retain your data
              for as long as your account is active, or as needed to provide the service. You
              may request deletion of your data at any time (see Section 8).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Disconnecting Accounts & Data Deletion</h2>
            <p>
              You can disconnect a Facebook Page or Instagram account at any time from your
              client&apos;s Social Accounts settings page. Disconnecting revokes our access and
              we delete the stored access token. To request full deletion of your account and
              associated data, contact us using the information in Section 9.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Children&apos;s Privacy</h2>
            <p>
              AutoSocial AI is intended for business use and is not directed at individuals
              under the age of 18. We do not knowingly collect personal information from
              children.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or wish to request data
              deletion, contact us at{" "}
              <a href="mailto:linuxlabmedia@gmail.com" className="text-violet-400 hover:text-violet-300">
                linuxlabmedia@gmail.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Material changes will be
              reflected by updating the &quot;Last updated&quot; date above.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

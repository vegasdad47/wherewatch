import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "WhereWatch terms of service.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-black text-white">Terms of Service</h1>
      <p className="mt-2 text-zinc-400">Last updated: July 30, 2026</p>

      <section className="mt-8 space-y-4 text-zinc-300">
        <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
        <p>
          By accessing WhereWatch (&ldquo;the Service&rdquo;), you agree to these Terms of Service.
          If you do not agree, please do not use the Service.
        </p>

        <h2 className="text-xl font-bold text-white">2. Description of Service</h2>
        <p>
          WhereWatch is a streaming availability search engine. We help you find where movies and
          TV shows are available to stream, rent, or buy. We do not host, stream, or distribute any
          content ourselves.
        </p>

        <h2 className="text-xl font-bold text-white">3. User Accounts</h2>
        <p>
          You may sign in using Google OAuth. You are responsible for maintaining the confidentiality
          of your account. We reserve the right to terminate accounts that violate these terms.
        </p>

        <h2 className="text-xl font-bold text-white">4. Premium Subscriptions</h2>
        <p>
          Premium features are available via paid subscription through Stripe. Subscriptions
          auto-renew unless cancelled. Refunds are handled on a case-by-case basis — contact
          support@wherewatch.app.
        </p>

        <h2 className="text-xl font-bold text-white">5. Third-Party Links</h2>
        <p>
          The Service contains links to third-party websites and services (Netflix, Amazon Prime,
          Apple TV, etc.). We are not responsible for the content, pricing, or availability of
          these third-party services. Prices shown on external sites may differ from what is
          displayed on WhereWatch.
        </p>

        <h2 className="text-xl font-bold text-white">6. Intellectual Property</h2>
        <p>
          Movie and TV show data is provided by TMDB and used in accordance with their terms.
          All trademarks, logos, and service names are the property of their respective owners.
          WhereWatch is not affiliated with any streaming service.
        </p>

        <h2 className="text-xl font-bold text-white">7. Disclaimer of Warranties</h2>
        <p>
          The Service is provided &ldquo;as is&rdquo; without warranties of any kind. We do not
          guarantee the accuracy of streaming availability data, which is provided by third parties
          and may change without notice.
        </p>

        <h2 className="text-xl font-bold text-white">8. Limitation of Liability</h2>
        <p>
          No Rug Labs shall not be liable for any indirect, incidental, or consequential damages
          arising from your use of the Service.
        </p>

        <h2 className="text-xl font-bold text-white">9. Changes to Terms</h2>
        <p>
          We may update these terms at any time. Continued use of the Service after changes
          constitutes acceptance of the new terms.
        </p>

        <h2 className="text-xl font-bold text-white">10. Contact</h2>
        <p>
          Questions? Contact us at{" "}
          <a href="mailto:support@wherewatch.app" className="text-blue-400 hover:underline">
            support@wherewatch.app
          </a>.
        </p>
      </section>
    </div>
  );
}

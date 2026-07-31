import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "WhereWatch privacy policy — how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
      <p className="mt-2 text-zinc-400">Last updated: July 29, 2026</p>

      <section className="mt-8 space-y-4 text-zinc-300">
        <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
        <p>
          WhereWatch collects minimal data to provide our service. When you sign in with Google,
          we receive your email address and name. We do not collect browsing history, location data,
          or device identifiers beyond what is necessary for authentication and subscription management.
        </p>

        <h2 className="text-xl font-bold text-white">2. How We Use Your Data</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>To authenticate you and maintain your account</li>
          <li>To manage your premium subscription via Stripe</li>
          <li>To send push notifications if you opt in (price drops, new availability)</li>
          <li>To display relevant ads (free tier only) via Google AdSense</li>
        </ul>

        <h2 className="text-xl font-bold text-white">3. Third-Party Services</h2>
        <p>
          We use the following third-party services that may collect data as governed by their own
          privacy policies:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Google OAuth</strong> — for sign-in</li>
          <li><strong>Stripe</strong> — for payment processing</li>
          <li><strong>Google AdSense</strong> — for advertising on the free tier</li>
          <li><strong>TMDB</strong> — for movie and TV show data</li>
          <li><strong>Firebase Cloud Messaging</strong> — for push notifications</li>
        </ul>

        <h2 className="text-xl font-bold text-white">4. Data Retention</h2>
        <p>
          We retain your account data as long as your account is active. You may request deletion
          of your account and associated data at any time by contacting us.
        </p>

        <h2 className="text-xl font-bold text-white">5. Your Rights</h2>
        <p>
          You have the right to access, correct, or delete your personal data. You may also opt out
          of personalized advertising through your device settings or by upgrading to Premium.
        </p>

        <h2 className="text-xl font-bold text-white">6. Contact</h2>
        <p>
          For privacy-related inquiries, contact us at{" "}
          <a href="mailto:privacy@wherewatch.app" className="text-blue-400 hover:underline">
            privacy@wherewatch.app
          </a>.
        </p>
      </section>
    </div>
  );
}

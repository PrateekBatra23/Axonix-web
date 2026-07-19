export const metadata = {
  title: "Privacy Policy",
  description: "How Avonzi collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-8 py-12">
      <h1 className="text-2xl font-semibold mb-2">Privacy Policy</h1>
      <p className="text-xs font-mono text-faint mb-10">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="space-y-8 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">Overview</h2>
          <p>Avonzi ("we," "us") publishes daily AI news summaries and job listings. This policy explains what information we collect when you use this site and how it's handled.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">Information we collect</h2>
          <p>We don't require an account to use this site, and we don't collect names, email addresses, or other personal identifiers directly from visitors. The following data may be collected automatically:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Standard server logs (IP address, browser type, pages visited, timestamps) via our hosting providers</li>
            <li>Anonymous usage analytics, if enabled, to understand traffic patterns</li>
            <li>If you flag a job listing, we record that action and any reason you select — no personal information is attached to it</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">Cookies</h2>
          <p>This site may use cookies for basic functionality (such as remembering that you've dismissed this notice) and, in the future, for advertising served through Google AdSense. If AdSense is active, Google may use cookies to serve ads based on your visits to this and other sites. You can control cookies through your browser settings.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">Third-party services</h2>
          <p>This site relies on the following third-party services to operate:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Vercel</strong> — frontend hosting</li>
            <li><strong>Railway</strong> — backend hosting</li>
            <li><strong>Supabase</strong> — database hosting</li>
            <li><strong>Anthropic (Claude API)</strong> — used to generate story summaries from source reporting</li>
            <li><strong>Pexels</strong> — source of placeholder photography used when a story has no original image</li>
            <li><strong>Google AdSense</strong> — planned for future use to display advertising</li>
          </ul>
          <p className="mt-2">Each of these providers has its own privacy practices, which we encourage you to review.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">Content sourcing</h2>
          <p>Story summaries are generated from publicly available reporting and are not a substitute for the original source. Job listings are aggregated from public job boards and company career pages. We are not responsible for the accuracy of third-party job listings — use the flag feature if you notice an issue.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">Children's privacy</h2>
          <p>This site is not directed at children under 13, and we do not knowingly collect information from them.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">Changes to this policy</h2>
          <p>We may update this policy as the site evolves. Material changes will be reflected by updating the date at the top of this page.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">Contact</h2>
          <p>Questions about this policy can be directed via the contact information on <a href="https://prateekbatra.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition">prateekbatra.dev</a>.</p>
        </section>
      </div>
    </main>
  );
}
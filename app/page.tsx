import Link from "next/link";
import { ArrowRight, Zap, Shield, TrendingUp, Users } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-cyan-50 text-emerald-950 dark:from-emerald-950 dark:via-zinc-950 dark:to-cyan-950 dark:text-emerald-100">
      <SiteHeader />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center space-y-8">
        <p className="inline-flex items-center rounded-full border border-emerald-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-700/70 dark:bg-emerald-950/40 dark:text-emerald-300">
          Secure • Transparent • Automated
        </p>
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            The Future of African Savings Groups
          </h1>
          <p className="text-lg sm:text-xl text-emerald-800/80 dark:text-emerald-200/80 max-w-2xl mx-auto">
            Digitize your chama with blockchain-powered transparency, automated
            contributions, and real-time financial insights.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/register"
            className="px-8 py-3 rounded-xl bg-linear-to-r from-emerald-600 to-teal-500 text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/30"
          >
            Create Account <ArrowRight className="size-5" />
          </Link>
          <Link
            href="/onboard-chama"
            className="px-8 py-3 rounded-xl border-2 border-emerald-700 text-emerald-800 dark:text-emerald-100 dark:border-emerald-400 font-bold hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
          >
            Onboard Chama
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white/85 dark:bg-emerald-950/20 py-16 sm:py-24 border-y border-emerald-100 dark:border-emerald-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Why Choose ChamaConnect?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Secure & Transparent",
                description:
                  "Blockchain-verified transactions with immutable records",
              },
              {
                icon: Zap,
                title: "Instant Setup",
                description: "Create or join a chama in minutes, not hours",
              },
              {
                icon: TrendingUp,
                title: "Smart Analytics",
                description: "Real-time dashboards and financial insights",
              },
              {
                icon: Users,
                title: "Easy Collaboration",
                description: "Invite members and manage roles effortlessly",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-xl border border-emerald-100 dark:border-emerald-800/40 bg-white dark:bg-emerald-950/25 hover:-translate-y-0.5 transition-all space-y-3"
                >
                  <Icon className="size-8 text-emerald-700 dark:text-emerald-300" />
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-emerald-900/70 dark:text-emerald-200/70">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supported Groups Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Supports All Group Types
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "SACCO Groups",
                description:
                  "Perfect for structured savings, loans, and contributions",
              },
              {
                title: "Table Banking",
                description:
                  "Great for regular meetings and community-driven savings",
              },
              {
                title: "Merry-Go-Round",
                description:
                  "Ideal for rotating savings distribution and funds",
              },
            ].map((group, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-linear-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/30 dark:to-cyan-900/20 border border-emerald-100 dark:border-emerald-800/40 space-y-2"
              >
                <h3 className="font-semibold text-lg">{group.title}</h3>
                <p className="text-sm text-emerald-900/70 dark:text-emerald-200/70">
                  {group.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-r from-emerald-700 via-emerald-800 to-teal-700 text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready to Transform Your Chama?
          </h2>
          <p className="text-lg text-emerald-50/85">
            Join hundreds of groups already using ChamaConnect to manage their
            finances with transparency and ease.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 rounded-xl bg-emerald-800 text-emerald-900 dark:text-emerald-950 border border-emerald-100 font-bold hover:bg-emerald-900 transition-colors shadow-sm"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      <section className="border-t border-emerald-100/60 bg-emerald-900 py-14 text-emerald-50 dark:border-emerald-800/50 dark:bg-emerald-950">
        <div className="mx-auto w-full max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200/90">
            Newsletter
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Stay updated with ChamaConnect releases
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-emerald-100/85">
            Get product updates, hackathon progress highlights, and early access
            invites delivered to your inbox.
          </p>
          <div className="mx-auto mt-5 max-w-xl text-left text-xs text-emerald-100/75">
            Email <span className="text-red-300">*</span>
          </div>
          <NewsletterForm />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

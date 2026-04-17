import Link from "next/link";
import { ArrowRight, Zap, Shield, TrendingUp, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 to-zinc-100 dark:from-black dark:to-zinc-900">
      {/* Navigation */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm sticky top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-xl font-bold">ChamaConnect</div>
          <div className="flex gap-4">
            <Link
              href="/register"
              className="px-4 py-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            The Future of African Savings Groups
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Digitize your chama with blockchain-powered transparency, automated
            contributions, and real-time financial insights.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/register"
            className="px-8 py-3 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            Create Account <ArrowRight className="size-5" />
          </Link>
          <Link
            href="/onboard-chama"
            className="px-8 py-3 rounded-lg border-2 border-zinc-900 dark:border-zinc-50 text-zinc-900 dark:text-zinc-50 font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            Onboard Chama
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-zinc-900/50 py-16 sm:py-24">
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
                  className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-50 transition-colors space-y-3"
                >
                  <Icon className="size-8 text-zinc-900 dark:text-zinc-50" />
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
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
                className="p-6 rounded-xl bg-linear-to-br from-zinc-50 dark:from-zinc-900/50 to-zinc-100 dark:to-zinc-800/50 border border-zinc-200 dark:border-zinc-800 space-y-2"
              >
                <h3 className="font-semibold text-lg">{group.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {group.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-zinc-900 dark:bg-black text-zinc-50 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready to Transform Your Chama?
          </h2>
          <p className="text-lg text-zinc-300">
            Join hundreds of groups already using ChamaConnect to manage their
            finances with transparency and ease.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 rounded-lg bg-zinc-50 text-zinc-900 font-bold hover:opacity-90 transition-opacity"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          <p>© 2025 ChamaConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

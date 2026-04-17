import Link from "next/link";
import { ArrowRight, Zap, Shield, TrendingUp, Users } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export default function Home() {
  const features = [
    {
      icon: Shield,
      title: "Secure & Transparent",
      description: "Blockchain-verified transactions with immutable records.",
    },
    {
      icon: Zap,
      title: "Instant Setup",
      description: "Create or join a chama in minutes, then invite members.",
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description:
        "Real-time visibility into goals, contributions, and health.",
    },
    {
      icon: Users,
      title: "Easy Collaboration",
      description:
        "Assign roles and keep every member aligned and accountable.",
    },
  ];

  const groupTypes = [
    {
      title: "SACCO Groups",
      description:
        "Built for structured savings, loans, and disciplined growth.",
    },
    {
      title: "Table Banking",
      description:
        "Perfect for recurring meetings and community accountability.",
    },
    {
      title: "Merry-Go-Round",
      description: "Manage rotating payouts with a transparent digital record.",
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_15%_0%,#8ee8c420,transparent_40%),radial-gradient(circle_at_85%_10%,#6ee7d850,transparent_42%),linear-gradient(180deg,#f2fbf6_0%,#eaf7ef_36%,#e2f4ea_100%)] text-emerald-950 dark:bg-[radial-gradient(circle_at_20%_0%,#2dd4bf30,transparent_35%),radial-gradient(circle_at_80%_15%,#10b98140,transparent_30%),linear-gradient(180deg,#052c23_0%,#04271f_36%,#031e18_100%)] dark:text-emerald-100">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-linear-to-b from-white/50 to-transparent dark:from-emerald-950/40" />
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-10 lg:px-8 lg:py-24">
          <div className="space-y-7">
            <p className="inline-flex items-center rounded-full border border-emerald-300/70 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 shadow-sm backdrop-blur-sm dark:border-emerald-500/40 dark:bg-emerald-950/40 dark:text-emerald-200">
              Financial Trust, Digitized
            </p>

            <div className="space-y-5">
              <h1 className="max-w-xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                The savings OS built for African chama communities.
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-emerald-900/80 sm:text-lg dark:text-emerald-100/80">
                From weekly contributions to emergency loans, ChamaConnect gives
                your group one secure ledger, one source of truth, and one clear
                path to growth.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-7 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white! shadow-lg shadow-emerald-900/25 transition-all hover:-translate-y-0.5 hover:bg-emerald-900 hover:text-white!"
              >
                Start Your Chama
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/onboard-chama"
                className="inline-flex items-center justify-center rounded-xl border border-emerald-700/45 bg-white/70 px-7 py-3 text-sm font-bold uppercase tracking-[0.08em] text-emerald-900 transition-colors hover:bg-white dark:border-emerald-400/50 dark:bg-emerald-900/30 dark:text-emerald-100 dark:hover:bg-emerald-900/45"
              >
                Explore Onboarding
              </Link>
            </div>
          </div>

          <div className="relative lg:pl-4">
            <div className="absolute -left-8 top-8 hidden h-28 w-28 rounded-full border border-emerald-600/20 bg-emerald-300/10 blur-xl lg:block" />
            <div className="rounded-3xl border border-emerald-200/80 bg-white/85 p-6 shadow-[0_20px_70px_-30px_rgba(6,78,59,0.45)] backdrop-blur-sm dark:border-emerald-700/45 dark:bg-emerald-950/45">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700/90 dark:text-emerald-200/90">
                Live Snapshot
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-2xl border border-emerald-200/80 bg-linear-to-br from-white to-emerald-50 p-4 dark:border-emerald-700/60 dark:from-emerald-900/55 dark:to-emerald-950/70">
                  <p className="text-xs text-emerald-800/70 dark:text-emerald-200/70">
                    Active Groups
                  </p>
                  <p className="mt-1 text-3xl font-extrabold">248</p>
                </div>
                <div className="rounded-2xl border border-emerald-200/80 bg-linear-to-br from-white to-emerald-50 p-4 dark:border-emerald-700/60 dark:from-emerald-900/55 dark:to-emerald-950/70">
                  <p className="text-xs text-emerald-800/70 dark:text-emerald-200/70">
                    Monthly Contributions
                  </p>
                  <p className="mt-1 text-3xl font-extrabold">KES 6.4M</p>
                </div>
                <div className="rounded-2xl border border-emerald-200/80 bg-linear-to-br from-white to-emerald-50 p-4 dark:border-emerald-700/60 dark:from-emerald-900/55 dark:to-emerald-950/70">
                  <p className="text-xs text-emerald-800/70 dark:text-emerald-200/70">
                    Loan Turnaround
                  </p>
                  <p className="mt-1 text-3xl font-extrabold">48h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-3 sm:mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800/80 dark:text-emerald-200/90">
              Why Teams Choose ChamaConnect
            </p>
            <h2 className="max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
              The platform that removes friction from group finance.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group h-full space-y-4 rounded-2xl border border-emerald-200/70 bg-white/88 p-6 shadow-[0_12px_40px_-30px_rgba(6,78,59,0.7)] transition-all hover:-translate-y-1 hover:border-emerald-400/60 dark:border-emerald-700/50 dark:bg-emerald-950/35"
                >
                  <div className="inline-flex rounded-xl bg-emerald-100 p-2 text-emerald-800 transition-colors group-hover:bg-emerald-800 group-hover:text-emerald-50 dark:bg-emerald-900/40 dark:text-emerald-200 dark:group-hover:bg-emerald-100 dark:group-hover:text-emerald-900">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-emerald-900/70 dark:text-emerald-200/75">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-emerald-200/70 bg-linear-to-r from-white/60 via-emerald-50/75 to-white/70 py-16 dark:border-emerald-800/45 dark:from-emerald-950/20 dark:via-emerald-900/25 dark:to-emerald-950/20 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800/80 dark:text-emerald-200/90">
              Built For Every Chama Model
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              One system, multiple group structures.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {groupTypes.map((group, index) => (
              <div
                key={index}
                className="space-y-3 rounded-2xl border border-emerald-200/70 bg-white/92 p-6 shadow-[0_8px_28px_-24px_rgba(6,78,59,0.8)] dark:border-emerald-700/45 dark:bg-emerald-950/35"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700/85 dark:text-emerald-300/85">
                  0{index + 1}
                </p>
                <h3 className="text-lg font-bold">{group.title}</h3>
                <p className="text-sm leading-relaxed text-emerald-900/70 dark:text-emerald-200/75">
                  {group.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0a6a54_0%,#055541_42%,#044336_100%)] py-16 text-white sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(110,231,183,0.35),transparent_34%),radial-gradient(circle_at_82%_84%,rgba(103,232,249,0.26),transparent_38%)]" />
        <div className="mx-auto flex w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative w-full rounded-3xl border border-emerald-300/45 bg-emerald-900/35 p-6 text-center shadow-xl shadow-emerald-950/20 backdrop-blur-sm sm:p-8 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200/90">
              Newsletter
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Stay updated with ChamaConnect releases
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-emerald-100/85">
              Get product updates, hackathon progress highlights, and early
              access invites delivered to your inbox.
            </p>
            <div className="mx-auto mt-5 max-w-xl text-left text-xs text-emerald-100/80">
              Email <span className="text-red-300">*</span>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

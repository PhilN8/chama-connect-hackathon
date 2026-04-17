import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSessionFromCookiesStore } from "@/lib/auth-server";
import { ContactForm } from "@/components/forms/ContactForm";

export default async function ContactPage() {
  const session = await getSessionFromCookiesStore();

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-cyan-50 text-emerald-950 dark:from-emerald-950 dark:via-zinc-950 dark:to-cyan-950 dark:text-emerald-100">
      <SiteHeader isAuthenticated={Boolean(session)} />

      <main className="w-full px-4 py-10 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-5xl space-y-8">
          <div className="space-y-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
              Contact Us
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Let us build ChamaConnect with you
            </h1>
            <p className="mx-auto max-w-2xl text-emerald-900/70 dark:text-emerald-200/80">
              Questions, feedback, partnership ideas, or pilot opportunities.
              Reach out and our team will get back to you.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-emerald-100 bg-white/90 p-5 dark:border-emerald-800/40 dark:bg-emerald-950/25">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                Email
              </p>
              <p className="mt-2 text-sm font-semibold">
                hello@chamaconnect.io
              </p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-white/90 p-5 dark:border-emerald-800/40 dark:bg-emerald-950/25">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                Phone
              </p>
              <p className="mt-2 text-sm font-semibold">+254 700 123 456</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-white/90 p-5 dark:border-emerald-800/40 dark:bg-emerald-950/25">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                Location
              </p>
              <p className="mt-2 text-sm font-semibold">Nairobi, Kenya</p>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white/95 p-6 shadow-sm dark:border-emerald-800/40 dark:bg-emerald-950/25 md:p-8">
            <ContactForm />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

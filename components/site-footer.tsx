export function SiteFooter() {
  return (
    <footer className="border-t border-emerald-100 bg-white/80 py-8 dark:border-emerald-900/40 dark:bg-emerald-950/25">
      <div className="w-full space-y-2 px-4 text-center text-sm text-emerald-800/70 dark:text-emerald-200/70 sm:px-6 lg:px-8">
        <p>© 2025 ChamaConnect. All rights reserved.</p>
        <p className="text-xs text-amber-700/90 dark:text-amber-200/80">
          Demo disclaimer: This is a hackathon prototype and does not represent
          the final production product.
        </p>
      </div>
    </footer>
  );
}

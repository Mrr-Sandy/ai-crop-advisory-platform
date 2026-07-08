import { Code2, Leaf } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-8 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-700" aria-hidden="true" />
          <p className="text-sm">
            © 2026 AI Crop Advisory Platform. Built for practical crop decisions.
          </p>
        </div>
        <a
          href="https://github.com"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors hover:text-green-700 dark:text-slate-200 dark:hover:text-green-300"
        >
          <Code2 className="h-4 w-4" aria-hidden="true" />
          Project repository
        </a>
      </div>
    </footer>
  );
}

export default Footer;

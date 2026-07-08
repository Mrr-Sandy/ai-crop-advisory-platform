function Loader({ text = "Loading..." }) {
  return (
    <div
      className="flex items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white p-6 text-sm font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
      role="status"
      aria-live="polite"
    >
      <span
        className="h-5 w-5 animate-spin rounded-full border-2 border-green-700 border-t-transparent"
        aria-hidden="true"
      />
      {text}
    </div>
  );
}

export default Loader;

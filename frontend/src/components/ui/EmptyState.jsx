function EmptyState({ title, message, action }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-base font-semibold text-slate-950 dark:text-white">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {message}
      </p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export default EmptyState;

function Input({
  id,
  label,
  helperText,
  error,
  className = "",
  type = "text",
  ...props
}) {
  return (
    <div className="grid gap-2">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-slate-800 dark:text-slate-100">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        type={type}
        className={`min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-colors duration-200 placeholder:text-slate-400 focus:border-green-700 focus:ring-2 focus:ring-green-700/15 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 ${className}`}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${id}-helper`} className="text-sm text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

export default Input;

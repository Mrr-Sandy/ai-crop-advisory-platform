const variants = {
  primary:
    "border-green-700 bg-green-700 text-white hover:bg-green-800 focus-visible:outline-green-700",
  secondary:
    "border-teal-700 bg-teal-700 text-white hover:bg-teal-800 focus-visible:outline-teal-700",
  outline:
    "border-slate-300 bg-white text-slate-800 hover:bg-slate-50 focus-visible:outline-green-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
  ghost:
    "border-transparent bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:outline-green-700 dark:text-slate-200 dark:hover:bg-slate-800",
  danger:
    "border-red-700 bg-red-700 text-white hover:bg-red-800 focus-visible:outline-red-700",
};

function Button({
  children,
  text,
  type = "button",
  variant = "primary",
  isLoading = false,
  className = "",
  disabled,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : null}
      {children || text}
    </button>
  );
}

export default Button;

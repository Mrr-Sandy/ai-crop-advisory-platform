function Toast({ message, tone = "success" }) {
  const toneClass =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
      : "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200";

  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm font-medium shadow-sm ${toneClass}`}
      role={tone === "error" ? "alert" : "status"}
    >
      {message}
    </div>
  );
}

export default Toast;

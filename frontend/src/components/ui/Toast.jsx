function Toast({ message, tone = "success" }) {
  const toneClass = tone === "error" ? "bg-error-soft" : "bg-olive-soft";

  return (
    <div
      className={`rounded-card px-4 py-3 text-sm font-medium text-ink ${toneClass}`}
      role={tone === "error" ? "alert" : "status"}
    >
      {message}
    </div>
  );
}

export default Toast;

function Loader({ text = "Loading..." }) {
  return (
    <div
      className="flex items-center gap-3 py-6 text-sm font-medium text-muted"
      role="status"
      aria-live="polite"
    >
      <span className="spinner keep-motion text-ink" aria-hidden="true" />
      {text}
    </div>
  );
}

export default Loader;

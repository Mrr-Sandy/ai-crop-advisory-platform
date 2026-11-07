function EmptyState({ title, message, action }) {
  return (
    <div className="py-8">
      <h3 className="text-title">{title}</h3>
      <p className="mt-2 max-w-[60ch] text-muted">{message}</p>
      {action ? <div className="mt-6 flex">{action}</div> : null}
    </div>
  );
}

export default EmptyState;

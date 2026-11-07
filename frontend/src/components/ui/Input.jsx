function Input({
  id,
  label,
  helperText,
  error,
  density,
  className = "",
  type = "text",
  ...props
}) {
  return (
    <div className={`field ${density === "app" ? "field--app" : ""}`}>
      {label ? (
        <label htmlFor={id} className="field__label">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        type={type}
        className={`field__input ${className}`}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="field__note field__note--error">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${id}-helper`} className="field__note">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

export default Input;

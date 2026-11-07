const variants = {
  primary: "key--primary",
  secondary: "key--ink",
  outline: "",
  ghost: "key--ghost",
  danger: "key--danger",
};

function Button({
  children,
  text,
  type = "button",
  variant = "primary",
  size,
  isLoading = false,
  className = "",
  disabled,
  ...props
}) {
  const sizeClass = size === "app" ? "key--app" : size === "icon" ? "key--app key--icon" : "";

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading ? "true" : undefined}
      className={`key ${variants[variant] ?? ""} ${sizeClass} ${className}`}
      {...props}
    >
      {isLoading ? <span className="spinner" aria-hidden="true" /> : null}
      {children || text}
    </button>
  );
}

export default Button;

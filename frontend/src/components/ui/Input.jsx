/**
 * Input Component
 * Props:
 * - placeholder: string
 * - type: string
 */

function Input({ placeholder, type = "text" }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      style={{
        padding: "10px",
        width: "250px",
        border: "1px solid #ccc",
        borderRadius: "6px",
      }}
    />
  );
}

export default Input;
/**
 * Button Component
 * Props:
 * - text: string
 * - onClick: function
 */

function Button({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      {text}
    </button>
  );
}

export default Button;
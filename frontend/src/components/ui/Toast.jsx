/**
 * Toast Component
 * Props:
 * - message: string
 */

function Toast({ message }) {
  return (
    <div
      style={{
        backgroundColor: "#22c55e",
        color: "white",
        padding: "10px 15px",
        borderRadius: "6px",
        width: "fit-content",
      }}
    >
      {message}
    </div>
  );
}

export default Toast;
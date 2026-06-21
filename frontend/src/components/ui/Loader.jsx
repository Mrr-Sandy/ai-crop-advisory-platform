/**
 * Loader Component
 * Props:
 * - text: string
 */

function Loader({ text = "Loading..." }) {
  return (
    <div
      style={{
        padding: "10px",
        fontWeight: "bold",
      }}
    >
      ⏳ {text}
    </div>
  );
}

export default Loader;
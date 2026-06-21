/**
 * Modal Component
 * Props:
 * - isOpen: boolean
 * - title: string
 * - children: ReactNode
 * - onClose: function
 */

function Modal({ isOpen, title, children, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          minWidth: "300px",
        }}
      >
        <h3>{title}</h3>

        <div>{children}</div>

        <button
          onClick={onClose}
          style={{
            marginTop: "10px",
            padding: "8px 15px",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default Modal;
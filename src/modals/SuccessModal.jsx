const modalStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
};

const modalInStyles = {
    background: "white",
    padding: 24,
    borderRadius: 8,
    minWidth: 300,
    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
    position: "relative",
};

const buttonStyles = {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: 4,
    cursor: "pointer",
};

function SuccessModal({ open, message, onClose, title }) {
    if (!open) return null;

    return (
        <div
            className="modal-backdrop"
            style={{ modalStyles }}
            onClick={onClose}
        >
            <div
                className="modal"
                style={{ modalInStyles }}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 style={{ margin: 0, marginBottom: 10, color: "#16a34a" }}>
                    {title || "Success"}
                </h3>
                <div style={{ marginBottom: 18 }}>{message}</div>
                <button
                    onClick={onClose}
                    style={{ buttonStyles }}
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default SuccessModal;
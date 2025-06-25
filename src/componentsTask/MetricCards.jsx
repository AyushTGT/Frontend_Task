export default function MetricCards({ metrics }) {
    const cardStyle = {
        flex: "1 1 160px",
        background: "#fff",
        borderRadius: 10,
        padding: "20px 16px",
        marginRight: 20,
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: 150,
        minHeight: 90,
    };

    return (
        <div style={{ display: "flex", gap: 20, marginBottom: 32, flexWrap: "wrap" }}>
            {metrics.map((m) => (
                <div key={m.label} style={cardStyle}>
                    <span style={{ fontSize: 14, color: "#888" }}>{m.label}</span>
                    <span style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{m.value}</span>
                </div>
            ))}
        </div>
    );
}
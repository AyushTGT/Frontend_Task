import Dashboard from "./Dashboard";

const homeContainerStyle = {
    display: "flex",
    flexDirection: "row",
    
};

export default function Home() {
    return (
        <div style={homeContainerStyle}>
            <Dashboard />
        </div>
    );
}

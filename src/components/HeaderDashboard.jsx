import React from "react";
import ProfileButton from "./UserProfiledetail";

// Header component with profiel button

export default function Header({ user }) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "32px",
                background: "#fff",
                borderRadius: "10px",
                padding: "24px 28px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
            }}
        >
            <div style={{ fontSize: "1.3rem", fontWeight: 600 }}>
                Hi, {user?.name || "User"} 👋
            </div>
            <ProfileButton />
        </div>
    );
}
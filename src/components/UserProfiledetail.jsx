import React, { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";

//Modal for showing the user profile details
// with logout and account deactivsation options

export default function ProfileButton() {
    const [showProfile, setShowProfile] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const popupRef = useRef(null);
    const token = Cookies.get("jwt_token");

    const buttonStyle = {
        border: "none",
        background: "#eee",
        borderRadius: "50%",
        width: 44,
        height: 44,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.5rem",
        position: "relative",
        zIndex: 2,
    };

    const profileStyle = {
        position: "absolute",
        top: 50,
        right: 0,
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        background: "#f9f9f9",
        width: "300px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginTop: "10px",
        zIndex: 10,
    };

    const logoutStyle = {
        backgroundColor: "#f44336",
        color: "white",
        padding: "8px 16px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px",
        marginTop: "15px",
    };

    const fetchUser = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("http://localhost:8000/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to fetch user");
            const data = await res.json();
            setUser(data);
            setShowProfile(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        fetch("http://localhost:8000/logout", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        }).then(() => {
            Cookies.remove("jwt_token");
            window.location.href = "/login"; 
        });
    };

    const handleDeactivate = (id) => {
        if (
            !window.confirm(
                "Are you sure you want to deactivate your account? This action cannot be undone."
            )
        ) {
            return;
        }
        fetch(`http://localhost:8000/delUser/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        }).then(() => {
            Cookies.remove("jwt_token");
            window.location.href = "/login";
        });
    };

    useEffect(() => {
        if (!showProfile) return;
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [showProfile]);

    return (
        <div style={{ position: "relative", display: "inline-block" }}>
            <button style={buttonStyle} onClick={fetchUser} disabled={loading}>
                <span role="img" aria-label="profile">
                    👤
                </span>
            </button>
            {error && (
                <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
            )}
            {showProfile && user && (
                <div ref={popupRef} style={profileStyle}>
                    <h2 style={{ margin: "0 0 10px 0" }}>{user.name}</h2>
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                        <strong>Name:</strong> {user.name}
                    </p>
                    <p>
                        <strong>Role:</strong> {user.post}
                    </p>
                    <p>
                        <strong>Created at:</strong> {user.created_at}
                    </p>
                    <p>
                        <strong>Email Verified:</strong>{" "}
                        {user.email_verified_at !== null ? "Yes" : "No"}
                    </p>
                    <p>
                        <strong>Total Duration:</strong>{" "}
                        {user.total_duration_loggedin}
                    </p>
                    <button style={logoutStyle} onClick={handleLogout}>
                        Logout
                    </button>
                    <button
                        style={logoutStyle}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeactivate(user.id);
                        }}
                    >
                        Deactivate Account
                    </button>
                    {/* <button onClick={handleLogout}>Edit Profile</button> */}
                </div>
            )}
        </div>
    );
}

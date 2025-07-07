import { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { UserOutlined } from "@ant-design/icons";
import "./Dashboard.css";

//Modal for showing the user profile details
// with logout and account deactivsation options

export default function ProfileButton() {
    const [showProfile, setShowProfile] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const popupRef = useRef(null);
    const token = Cookies.get("jwt_token");

    const fetchUser = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/me`, {
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
        fetch(`${process.env.REACT_APP_API_URL}/logout`, {
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
        fetch(`${process.env.REACT_APP_API_URL}/delUser/${id}`, {
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
            <button className="button-style"  onClick={fetchUser} disabled={loading}>
                <span role="img" aria-label="profile">
                    <UserOutlined />
                </span>
            </button>
            {error && (
                <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
            )}
            {showProfile && user && (
                <div ref={popupRef} className="profile-style" >
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
                        <strong>Created at:</strong> {new Date(user.created_at).toLocaleString()}
                    </p>
                    <p>
                        <strong>Email Verified:</strong>{" "}
                        {user.email_verified_at !== null ? "Yes" : "No"}
                    </p>
                    <p>
                        <strong>Total Duration:</strong>{" "}
                        {user.total_duration_loggedin}
                    </p>
                    <button className="logout-style" onClick={handleLogout}>
                        Logout
                    </button>
                    <button
                        className="logout-style"
                        style={{ marginLeft: "10px" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeactivate(user.id);
                        }}
                    >
                        Deactivate Account
                    </button>
                </div>
            )}
        </div>
    );
}

import ProfileButton from "./UserProfiledetail";
import "./Dashboard.css";

// Header component with profiel button

export default function Header({ user }) {
    return (
        <div
            className="header-dashboard"
        >
            <div style={{ fontSize: "1.3rem", fontWeight: 600 }}>
                Hi, {user?.name || "User"} <i class="fa fa-hand-peace-o" aria-hidden="true"></i>
            </div>
            <ProfileButton />
        </div>
    );
}
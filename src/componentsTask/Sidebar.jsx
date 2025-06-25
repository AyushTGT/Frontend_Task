import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { name: "Home", path: "/home" },
        { name: "Tasks", path: "/tasks" },
        { name: "All Tasks", path: "/tasklisting" },
        { name: "User Listing", path: "/dashboard" },
    ];

    function onMenuClick(path) {
        navigate(path);
    }

    return ( 
        <div className="sidebar-container">
            <div className="sidebar-header">
                Task Management
            </div>
            <div className="sidebar-menu">
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        className={`sidebar-menu-item${location.pathname === item.path ? " selected" : ""}`}
                        onClick={() => onMenuClick(item.path)}
                    >
                        {item.name}
                    </div>
                ))}
            </div>
        </div>
    );
}
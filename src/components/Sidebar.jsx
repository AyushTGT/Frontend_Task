import { useNavigate, useLocation } from "react-router-dom";
import { TeamOutlined, HomeOutlined } from "@ant-design/icons";
import "../componentsTask/Sidebar.css";

export default function SidebarUser() {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { name: "User Listing", path: "/dashboard", icon: <TeamOutlined /> },
        { name: "User Card", path: "/usercard", icon: <TeamOutlined /> },
        { name: "Task Management", path: "/Home", icon: <HomeOutlined /> },
    ];

    function onMenuClick(path) {
        navigate(path);
    }

    return (
        <div className="sidebar-container">
            <div className="sidebar-header">User Management</div>
            <div className="sidebar-menu">
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        className={`sidebar-menu-item${
                            location.pathname === item.path ? " selected" : ""
                        }`}
                        onClick={() => onMenuClick(item.path)}
                    >
                        <span className="sidebar-menu-icon">{item.icon}</span>
                        {item.name}
                    </div>
                ))}
            </div>
        </div>
    );
}
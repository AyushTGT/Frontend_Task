import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { HomeOutlined, CheckSquareOutlined, UnorderedListOutlined, TeamOutlined } from "@ant-design/icons";

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
  { name: "Home", path: "/home", icon: <HomeOutlined /> },
  { name: "Tasks", path: "/tasks", icon: <CheckSquareOutlined /> },
  { name: "All Tasks", path: "/tasklisting", icon: <UnorderedListOutlined /> },
  { name: "User Listing", path: "/dashboard", icon: <TeamOutlined /> },
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
                        <span className="sidebar-menu-icon">{item.icon}</span>
                        <span>{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
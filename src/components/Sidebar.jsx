import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../componentsTask/Sidebar.css";
import { TeamOutlined, HomeOutlined } from "@ant-design/icons";


export default function SidebarUser() {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
  { name: "User Listing", path: "/dashboard", icon: <TeamOutlined /> },
  { name: "Task Management", path: "/Home", icon: <HomeOutlined /> },
];

    function onMenuClick(path) {
        navigate(path);
    }

    return ( 
        <div className="sidebar-container">
            <div className="sidebar-header">
                User Management
            </div>
            <div className="sidebar-menu">
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        className={`sidebar-menu-item${location.pathname === item.path ? " selected" : ""}`}
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
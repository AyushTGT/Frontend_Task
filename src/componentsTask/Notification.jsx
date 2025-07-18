import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";
import axios from "axios";
import { BellOutlined } from "@ant-design/icons";

//Page for notification bell component

const bellStyle = {
    cursor: "pointer",
    fontSize: "1.6em",
    position: "relative",
    right: "-1000px",
    top: "-95px",
};

const textStyle = {
    position: "relative",
    top: "-6px",
    right: "0px",
    background: "red",
    color: "white",
    borderRadius: "50%",
    fontSize: "0.75em",
    padding: "2px 6px",
};

const dropStyle = {
    position: "fixed",
    right: 10,
    marginTop: -60,
    width: 320,
    background: "white",
    boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
    zIndex: 1000,
    borderRadius: 8,
    maxHeight: 350,
    overflowY: "auto",
};

const buttonStyle = {
    position: "fixed",
    right: 10,
    marginTop: -60,
    width: 320,
    background: "white",
    boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
    zIndex: 1000,
    borderRadius: 8,
    maxHeight: 350,
    overflowY: "auto",
};

export default function NotificationBell({ assigneeId }) {
    const [notifications, setNotifications] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        if (!assigneeId) return;
        axios
            .get(
                `${process.env.REACT_APP_API_URL}/notifications?assignee=${assigneeId}`,
                {}
            )
            .then((res) => {
                setNotifications(res.data || []);
            });
    }, [assigneeId]);

    useEffect(() => {
        if (!assigneeId) return;
        const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
            cluster: "ap2",
        });

        const channel = pusher.subscribe(`user.${assigneeId}`);
        channel.bind("notification.created", function (data) {
            console.log(32);

            setNotifications((prev) => [data.notification, ...prev]);
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        };
    }, [assigneeId]);

    const markAsRead = (id) => {
        axios
            .post(`${process.env.REACT_APP_API_URL}/notifications/${id}/read`)
            .then(() => {
                setNotifications((prev) => prev.filter((n) => n.id !== id));
            });
    };

    useEffect(() => {
        if (!dropdownOpen) return;

        const handleClickOutside = (event) => {
            if (
                bellRef.current &&
                !bellRef.current.contains(event.target) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownOpen]);

    const bellRef = React.useRef(null);
    const dropdownRef = React.useRef(null);

    return (
        <div style={{ display: "inline-block" }}>
            <span
                ref={bellRef}
                style={ bellStyle }
                onClick={() => setDropdownOpen((v) => !v)}
            >
                <BellOutlined />
                {notifications.length > 0 && (
                    <span style={ textStyle }>{notifications.length}</span>
                )}
            </span>
            {dropdownOpen && (
                <div ref={dropdownRef} style={ dropStyle }>
                    {notifications.length === 0 ? (
                        <div style={{ padding: 16, color: "#888" }}>
                            No new notifications
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                style={{
                                    borderBottom: "1px solid #eee",
                                    padding: "12px 16px",
                                }}
                            >
                                <div
                                    style={{
                                        fontWeight: "bold",
                                        marginBottom: 4,
                                    }}
                                >
                                    {n.title}
                                </div>
                                <div style={{ fontSize: 14 }}>
                                    {n.description}
                                </div>
                                {n.status && (
                                    <div
                                        style={{
                                            fontSize: 12,
                                            color: "#999",
                                            marginTop: 4,
                                        }}
                                    >
                                        Status: {n.status}
                                    </div>
                                )}
                                <button
                                    style={ buttonStyle }
                                    onClick={() => markAsRead(n.id)}
                                >
                                    Mark as read
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

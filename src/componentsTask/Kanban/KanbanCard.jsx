import React, { memo, useMemo } from "react";
import dayjs from "dayjs";
import "./Kanban.css";
import Cookies from "js-cookie";

function getDateColor({ date }) {
    const now = dayjs();
    const due = dayjs(date);
    if (due.isBefore(now, "day")) return "danger";
    if (due.isSame(now, "day")) return "warning";
    return "success";
}

function CustomAvatar({ name}) {
    const id= Cookies.get("userid");
    const initials = name.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    return (
        <span className="user-avatar" title={name.name} style={{ backgroundColor: id==name.id ? "#4CAF50" : "#e53935" }}>
            {initials}
        </span>
    );
}

function Text({ children}) {
    const className = "card-title-ellipsis";
    return (
        <span 
            className={className} 
            title={children}
        >
            {children}
        </span>
    );
}

function TextIcon(props) {
    return (
        <span className="text-icon" {...props}>
            <i className="fa fa-file-text-o" aria-hidden="true"></i>
        </span>
    );
}

function Tooltip({ title, children }) {
    return <span title={title}>{children}</span>;
}

const ClockCircleOutlined = (props) => (
    <span className="clock-icon" {...props}>
        <i className="fa fa-clock-o" aria-hidden="true"></i>
    </span>
);

// The ProjectCard component
export function ProjectCard({
    id,
    title,
    dueDate,
    users,
    onView,
}) {
    
    const dueDateOptions = useMemo(() => {
        if (!dueDate) return null;
        const date = dayjs(dueDate);
        return {
            colorClass: getDateColor({ date: dueDate }),
            text: date.format("MMM D"),
        };
    }, [dueDate]);

    // Only show one assignee (the first user in array)
    const assignee =
        users && Array.isArray(users) && users.length > 0 ? users[0] : null;

    return (
        <div
            className="project-card"
            onClick={() => onView?.(id)}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => (e.key === "Enter" ? onView?.(id) : undefined)}
        >
            <div className="card-header">
                <Text ellipsis={{ tooltip: title }}>{title}</Text>
            </div>
            <div className="card-content">
                <TextIcon />
                {dueDateOptions && (
                    <span className={`tag tag-${dueDateOptions.colorClass}`}>
                        <ClockCircleOutlined />
                        {dueDateOptions.text}
                    </span>
                )}
                {assignee && (
                    <div className="user-group">
                        <Tooltip title={assignee.name}>
                            <CustomAvatar
                                name={assignee}
                            />
                        </Tooltip>
                    </div>
                )}
            </div>
        </div>
    );
}

// Memoized version (for performance)
export const ProjectCardMemo = memo(
    ProjectCard,
    (prev, next) =>
        prev.id === next.id &&
        prev.title === next.title &&
        prev.dueDate === next.dueDate &&
        prev.users?.length === next.users?.length &&
        prev.updatedAt === next.updatedAt
);
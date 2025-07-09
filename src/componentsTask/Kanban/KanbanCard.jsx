import React, { memo, useEffect, useMemo } from "react";
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

function CustomAvatar({ name }) {
    const id = Cookies.get("userid");
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    
    const isCurrentUser = id == name;
    
    return (
        <div className="user-avatar-container">
            {/* <span 
                className={`user-avatar ${isCurrentUser ? 'current-user' : ''}`}
                title={name}
            >
                {initials}
                {isCurrentUser && <div className="current-user-indicator"></div>}
            </span> */}
            <span className="user-name">{name}</span>
        </div>
    );
}

function Text({ children }) {
    return (
        <h3 className="card-title-ellipsis" title={children}>
            {children}
        </h3>
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
    priority,
    assignee,
    status,
    onView,
}) {
    useEffect(() => {
        console.log(assignee);
    })
    
    const dueDateOptions = useMemo(() => {
        if (!dueDate) return null;
        const date = dayjs(dueDate);
        const now = dayjs();
        const isOverdue = date.isBefore(now, "day");
        const isToday = date.isSame(now, "day");
        
        return {
            colorClass: getDateColor({ date: dueDate }),
            text: date.format("MMM D"),
            fullDate: date.format("MMMM D, YYYY"),
            isOverdue,
            isToday,
        };
    }, [dueDate]);

    //const assignee = users && Array.isArray(users) && users.length > 0 ? users[0] : null;

    const getPriorityIcon = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return <i class="fas fa-circle fa-red"></i>;
            case 'medium':
                return <i class="fas fa-circle fa-yellow"></i>;
            case 'low':
                return <i class="fas fa-circle fa-green"></i>;
            default:
                return null;
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return <i class="fa fa-check" aria-hidden="true"></i>;
;
            
            case 'unassigned':
                return <i class="fa-solid fa-bars-progress"></i>;
            case 'pending':
                return <i class="fa-solid fa-timer"></i>;
            default:
                return <i class="fa fa-calendar" aria-hidden="true"></i>
;
        }
    };

    return (
        <div
            className={`project-card ${priority ? `priority-${priority.toLowerCase()}` : ''}`}
            onClick={() => onView?.(id)}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => (e.key === "Enter" ? onView?.(id) : undefined)}
        >
            {/* Card Header */}
            <div className="card-header">
                <div className="card-meta-header">
                    <span className="card-id">#{id}</span>
                    {priority && (
                        <div className={`priority-badge priority-${priority.toLowerCase()}`}>
                            {getPriorityIcon(priority)}
                            <span>{priority}</span>
                        </div>
                    )}
                </div>
                <Text>{title}</Text>
            </div>

            {/* Card Content */}
            <div className="card-content">
                <div className="card-meta-row">
                    <TextIcon />
                    
                    {/* Due Date or No Deadline */}
                    {dueDateOptions ? (
                        <div className={`tag tag-${dueDateOptions.colorClass}`} title={dueDateOptions.fullDate}>
                            <ClockCircleOutlined />
                            <span className="tag-text">{dueDateOptions.text}</span>
                            {dueDateOptions.isOverdue && <span className="overdue-indicator">!</span>}
                            {dueDateOptions.isToday && <span className="today-indicator">⚡</span>}
                        </div>
                    ) : (
                        <div className="tag tag-no-deadline">
                            <ClockCircleOutlined />
                            <span className="tag-text">No Deadline</span>
                        </div>
                    )}

                    {/* Priority Badge if not in header */}
                    {!priority && (
                        <div className="tag tag-no-priority">
                            <span><i class="fa-solid fa-note"></i></span>
                            <span className="tag-text">No Priority</span>
                        </div>
                    )}
                </div>

                {/* Status Row */}
                <div className="status-row">
                    <div className={`status-badge status-${status?.toLowerCase() || 'pending'}`}>
                        <span className="status-icon">{getStatusIcon(status)}</span>
                        <span className="status-text">{status || 'Pending'}</span>
                    </div>
                </div>

                {/* Assignee */}
                {assignee ? (
                    <div className="user-group">
                        <span className="assignee-label">Assigned to:</span>
                        <Tooltip title={assignee}>
                            <CustomAvatar name={assignee} />
                        </Tooltip>
                    </div>
                ) : (
                    <div className="user-group no-assignee">
                        <span className="assignee-label">Unassigned</span>
                        <div className="unassigned-avatar">
                            <span>👤</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Card Footer */}
            <div className="card-footer">
                <button className="view-btn" onClick={(e) => {
                    e.stopPropagation();
                    onView?.(id);
                }}>
                    <i className="fa fa-eye" aria-hidden="true"></i>
                    <span>View Details</span>
                </button>
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
        prev.priority === next.priority &&
        prev.status === next.status &&
        prev.updatedAt === next.updatedAt
);
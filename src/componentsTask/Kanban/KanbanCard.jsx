import React, { memo, useMemo } from "react";
import dayjs from "dayjs";

// CSS styles (same as before)
const cardStyles = {
    minWidth: "200px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
    background: "#fff",
    cursor: "pointer",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    transition: "box-shadow 0.2s",
    position: "relative",
};
const cardHeaderStyles = {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
    justifyContent: "space-between",
};
const cardTitleStyles = {
    fontWeight: "600",
    fontSize: "16px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
};
const moreButtonStyles = {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "20px",
    padding: "2px 8px",
    borderRadius: "50%",
    transition: "background 0.2s",
};
const tagStyles = (color) => ({
    display: "inline-flex",
    alignItems: "center",
    padding: "0 8px",
    borderRadius: "12px",
    fontSize: "12px",
    background: color === "default" ? "#f0f0f0" : color,
    color: color === "default" ? "#888" : "#fff",
    marginRight: "8px",
});
const userAvatarStyles = {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    objectFit: "cover",
    marginLeft: "-8px",
    border: "2px solid #fff",
    boxShadow: "0 0 2px #aaa",
    background: "#eee",
    display: "inline-block",
    textAlign: "center",
    lineHeight: "28px",
    fontWeight: "bold",
    fontSize: "13px",
    color: "#888",
};
const userGroupStyles = {
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",
};
const textIconStyles = {
    display: "inline-block",
    width: "18px",
    height: "18px",
    background: "#f0f0f0",
    borderRadius: "50%",
    marginRight: "4px",
};
const skeletonStyles = {
    background: "#eee",
    borderRadius: "4px",
    marginBottom: "8px",
};

function getDateColor({ date }) {
    const now = dayjs();
    const due = dayjs(date);
    if (due.isBefore(now, "day")) return "#f5222d";
    if (due.isSame(now, "day")) return "#faad14";
    return "#52c41a";
}

function CustomAvatar({ name }) {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    return (
        <span style={userAvatarStyles} title={name}>
            {initials}
        </span>
    );
}

function Text({ children, ellipsis }) {
    const style = ellipsis
        ? {
              ...cardTitleStyles,
              maxWidth: "180px",
          }
        : cardTitleStyles;
    return (
        <span style={style} title={ellipsis?.tooltip ? children : undefined}>
            {children}
        </span>
    );
}

function TextIcon(props) {
    return (
        <span style={textIconStyles} {...props}>
            <i class="fa fa-file-text-o" aria-hidden="true"></i>
        </span>
    );
}

function Tooltip({ title, children }) {
    return <span title={title}>{children}</span>;
}

// function DropdownMenu({ items, children }) {
//     const [open, setOpen] = React.useState(false);

//     const handleClick = (e) => {
//         e.stopPropagation();
//         setOpen((o) => !o);
//     };

//     return (
//         <span style={{ position: "relative" }}>
//             {React.cloneElement(children, {
//                 onClick: (e) => {
//                     e.stopPropagation();
//                     handleClick(e);
//                 },
//             })}
//             {open && (
//                 <div
//                     style={{
//                         position: "absolute",
//                         right: 0,
//                         top: "28px",
//                         background: "#fff",
//                         border: "1px solid #e0e0e0",
//                         borderRadius: "6px",
//                         minWidth: "120px",
//                         zIndex: 99,
//                         boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
//                     }}
//                 >
//                     {items.map((item) => (
//                         <div
//                             key={item.key}
//                             style={{
//                                 padding: "8px 16px",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 cursor: "pointer",
//                                 color: item.danger ? "#f5222d" : "#333",
//                                 borderBottom: "1px solid #f5f5f5",
//                                 background: "none",
//                                 fontWeight: item.danger ? "bold" : "normal",
//                             }}
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 if (item.onClick) item.onClick();
//                                 setOpen(false);
//                             }}
//                             onMouseDown={(e) => e.stopPropagation()}
//                         >
//                             {item.icon && (
//                                 <span style={{ marginRight: "8px" }}>
//                                     {item.icon}
//                                 </span>
//                             )}
//                             {item.label}
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </span>
//     );
// }

// Simple icons (replace with svg if you want)
// const EyeOutlined = () => <span style={{ fontSize: 16 }}>👁️</span>;
// const DeleteOutlined = () => (
//     <span style={{ fontSize: 16, color: "#f5222d" }}>🗑️</span>
// );
// const MoreOutlined = () => (
//     <span
//         style={{
//             fontSize: 18,
//             transform: "rotate(90deg)",
//             display: "inline-block",
//         }}
//     >
//         ⋮
//     </span>
// );
const ClockCircleOutlined = (props) => (
    <span style={{ fontSize: "13px", marginRight: "2px" }} {...props}>
        <i class="fa fa-clock-o" aria-hidden="true"></i>
    </span>
);

// The ProjectCard component
export function ProjectCard({
    id,
    title,
    dueDate,
    users,
    updatedAt,
    onView,
    onDelete,
}) {
    // Dropdown menu items
    // const dropdownItems = useMemo(
    //     () => [
    //         {
    //             label: "View card",
    //             key: "1",
    //             icon: <EyeOutlined />,
    //             onClick: () => onView?.(id),
    //         },
    //         {
    //             danger: true,
    //             label: "Delete card",
    //             key: "2",
    //             icon: <DeleteOutlined />,
    //             onClick: () => onDelete?.(id),
    //         },
    //     ],
    //     [id, onView, onDelete]
    // );

    const dueDateOptions = useMemo(() => {
        if (!dueDate) return null;
        const date = dayjs(dueDate);
        return {
            color: getDateColor({ date: dueDate }),
            text: date.format("MMM D"),
        };
    }, [dueDate]);

    // Only show one assignee (the first user in array)
    const assignee =
        users && Array.isArray(users) && users.length > 0 ? users[0] : null;

    return (
        <div
            style={cardStyles}
            onClick={() => onView?.(id)}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => (e.key === "Enter" ? onView?.(id) : undefined)}
        >
            <div style={cardHeaderStyles}>
                <Text ellipsis={{ tooltip: title }}>{title}</Text>
                {/* <DropdownMenu items={dropdownItems}>
                    <button
                        style={moreButtonStyles}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="More"
                    >
                        <MoreOutlined />
                    </button>
                </DropdownMenu> */}
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                }}
            >
                <TextIcon style={{ marginRight: "4px" }} />
                {dueDateOptions && (
                    <span style={tagStyles(dueDateOptions.color)}>
                        <ClockCircleOutlined />
                        {dueDateOptions.text}
                    </span>
                )}
                {assignee && (
                    <div style={userGroupStyles}>
                        <Tooltip title={assignee.name}>
                            <CustomAvatar
                                name={assignee.name}
                                src={assignee.avatarUrl}
                            />
                        </Tooltip>
                    </div>
                )}
            </div>
        </div>
    );
}

// ProjectCard skeleton for loading state
// export function ProjectCardSkeleton() {
//     return (
//         <div style={cardStyles}>
//             <div
//                 style={{ ...skeletonStyles, width: "160px", height: "18px" }}
//             />
//             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                 <div
//                     style={{ ...skeletonStyles, width: "80px", height: "14px" }}
//                 />
//                 <div
//                     style={{
//                         ...skeletonStyles,
//                         width: "28px",
//                         height: "28px",
//                         borderRadius: "50%",
//                     }}
//                 />
//             </div>
//         </div>
//     );
// }

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

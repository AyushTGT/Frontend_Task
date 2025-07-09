import React, { useEffect, useRef, useState } from "react";

// Util to get initials from a name
function getInitials(name = "") {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
}

function Badge({ children, color = "#e0e0e0", textColor = "#222" }) {
    return (
        <span
            style={{
                background: color,
                color: textColor,
                borderRadius: 8,
                padding: "2px 12px",
                fontSize: 13,
                display: "inline-block",
                fontWeight: 500,
            }}
        >
            {children}
        </span>
    );
}

const modalStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.35)",
    zIndex: 1111,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const cardStyles = {
    background: "#fff",
    padding: "40px 40px 32px 40px",
    borderRadius: 20,
    minWidth: 420,
    maxWidth: 500,
    boxShadow: "0 6px 32px rgba(0,0,0,0.13)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
};

const avatarStyles = {
    width: 74,
    height: 74,
    borderRadius: "50%",
    background: "#e1e7f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    fontWeight: 700,
    color: "#273c6d",
    marginBottom: 14,
};

const metaGrid = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    width: "100%",
    marginBottom: 24,
    marginTop: 8,
};

const sectionStyles = {
    width: "100%",
    background: "#f5f7fa",
    borderRadius: 12,
    padding: "20px 16px",
    marginBottom: 22,
    display: "flex",
    flexDirection: "column",
    gap: 8,
};

const fieldLabel = {
    fontSize: 13,
    color: "#6b7a99",
    fontWeight: 500,
};

const fieldValue = {
    fontSize: 16,
    color: "#222",
    fontWeight: 600,
};

const buttonRow = {
    display: "flex",
    gap: 10,
    justifyContent: "flex-end",
    marginTop: 18,
    width: "100%",
};

const buttonStyles = {
    padding: "8px 20px",
    borderRadius: 8,
    border: 0,
    background: "#273c6d",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 15,
};

const cancelButtonStyles = {
    ...buttonStyles,
    background: "#e0e0e0",
    color: "#273c6d",
};

const statusColors = {
    pending: { color: "#f9c846", text: "#664d03" },
    completed: { color: "#3bb77e", text: "#094d2b" },
    cancelled: { color: "#fa6c6c", text: "#7a2323" },
    unassigned: { color: "#b8b8b8", text: "#474747" },
};

const priorityColors = {
    low: { color: "#e3f2fd", text: "#1976d2" },
    medium: { color: "#fff8e1", text: "#ff9800" },
    high: { color: "#ffebee", text: "#d32f2f" },
};

export default function TaskDetailModal({
    open,
    onClose,
    task,
    onUpdate,
    userOptions,
    user,
}) {
    const [form, setForm] = useState(task || {});
    const [editing, setEditing] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {
        function handleClick(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClick);
        }
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open, onClose]);

    useEffect(() => {
        setForm(task || {});
        setEditing(false);
    }, [task, open]);

    if (!open) return null;

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleEdit = () => setEditing(true);

    const handleCancel = () => {
        setForm(task || {});
        setEditing(false);
        onClose();
    };

    const handleSave = () => {
        onUpdate(form);
    };

    // Get user display info
    const creator =
        userOptions?.find((u) => u.id === form.created_by) || null;
    const assignee =
        userOptions?.find((u) => u.id === form.assignee) || null;

    return (
        <div style={modalStyles}>
            <div ref={modalRef} style={cardStyles}>
                {/* Avatar and Name */}
                <div style={avatarStyles}>
                    {creator
                        ? getInitials(creator.name)
                        : form.created_by
                        ? getInitials(form.created_by)
                        : "?"}
                </div>
                <div style={{ fontSize: 21, fontWeight: 700, marginBottom: 4 }}>
                    {editing ? (
                        <input
                            name="title"
                            value={form.title || ""}
                            onChange={handleChange}
                            style={{
                                fontSize: 21,
                                fontWeight: 700,
                                border: "1px solid #dbe3ee",
                                borderRadius: 8,
                                padding: "3px 8px",
                                width: "100%",
                            }}
                            disabled={
                                !editing ||
                                !(user && user.id === form.created_by)
                            }
                        />
                    ) : form.title || "No Title"}
                </div>
                <div style={{ color: "#7d879c", fontSize: 15, marginBottom: 6 }}>
                    {creator?.name || form.created_by || "Unknown"}
                </div>
                {/* Task Meta */}
                <div style={metaGrid}>
                    <div>
                        <div style={fieldLabel}>Start Date</div>
                        {editing ? (
                            <input
                                type="date"
                                name="start_date"
                                value={
                                    form.start_date
                                        ? form.start_date.slice(0, 10)
                                        : ""
                                }
                                onChange={handleChange}
                                style={{
                                    width: "90%",
                                    borderRadius: 8,
                                    border: "1px solid #dbe3ee",
                                    padding: 8,
                                    fontSize: 15,
                                }}
                                disabled={true}
                            />
                        ) : (
                            <div style={fieldValue}>
                                {form.start_date
                                    ? form.start_date.slice(0, 10)
                                    : "-"}
                            </div>
                        )}
                    </div>
                    <div>
                        <div style={fieldLabel}>Due Date</div>
                        {editing ? (
                            <input
                                type="date"
                                name="due_date"
                                value={
                                    form.due_date
                                        ? form.due_date.slice(0, 10)
                                        : ""
                                }
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    borderRadius: 8,
                                    border: "1px solid #dbe3ee",
                                    padding: 8,
                                    fontSize: 15,
                                }}
                                disabled={
                                    !editing ||
                                    !(user && user.id === form.created_by)
                                }
                            />
                        ) : (
                            <div style={fieldValue}>
                                {form.due_date
                                    ? form.due_date.slice(0, 10)
                                    : "-"}
                            </div>
                        )}
                    </div>
                    <div>
                        <div style={fieldLabel}>Priority</div>
                        {editing ? (
                            <select
                                name="priority"
                                value={form.priority || ""}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    borderRadius: 8,
                                    border: "1px solid #dbe3ee",
                                    padding: 8,
                                    fontSize: 15,
                                }}
                                disabled={
                                    !editing ||
                                    !(user && user.id === form.created_by)
                                }
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        ) : (
                            <Badge
                                color={
                                    priorityColors[form.priority]?.color ||
                                    "#e0e0e0"
                                }
                                textColor={
                                    priorityColors[form.priority]?.text || "#222"
                                }
                            >
                                {form.priority || "None"}
                            </Badge>
                        )}
                    </div>
                    <div>
                        <div style={fieldLabel}>Status</div>
                        {editing ? (
                            <select
                                name="status"
                                value={form.status || ""}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    borderRadius: 8,
                                    border: "1px solid #dbe3ee",
                                    padding: 8,
                                    fontSize: 15,
                                }}
                                disabled={
                                    !editing ||
                                    !(user && user.id === form.assignee)
                                }
                            >
                                <option value="unassigned">Unassigned</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        ) : (
                            <Badge
                                color={
                                    statusColors[form.status]?.color ||
                                    "#e0e0e0"
                                }
                                textColor={
                                    statusColors[form.status]?.text || "#222"
                                }
                            >
                                {form.status || "unassigned"}
                            </Badge>
                        )}
                    </div>
                </div>
                {/* Description Section */}
                <div style={sectionStyles}>
                    <div style={fieldLabel}>Description</div>
                    {editing ? (
                        <textarea
                            name="description"
                            value={form.description || ""}
                            onChange={handleChange}
                            style={{
                                width: "90%",
                                minHeight: 56,
                                borderRadius: 8,
                                border: "1px solid #dbe3ee",
                                padding: 10,
                                fontSize: 15,
                            }}
                            disabled={
                                !editing ||
                                !(user && user.id === form.created_by)
                            }
                        />
                    ) : (
                        <div style={fieldValue}>
                            {form.description || (
                                <span style={{ color: "#aaa" }}>
                                    No description provided
                                </span>
                            )}
                        </div>
                    )}
                </div>
                {/* People Section */}
                <div style={sectionStyles}>
                    <div style={{ display: "flex", gap: 16 }}>
                        <div style={{ flex: 1 }}>
                            <div style={fieldLabel}>Assignee</div>
                            {editing ? (
                                <select
                                    name="assignee"
                                    value={
                                        form.assignee === null ||
                                        form.assignee === undefined
                                            ? ""
                                            : form.assignee
                                    }
                                    onChange={(e) => {
                                        setForm((prev) => ({
                                            ...prev,
                                            assignee:
                                                e.target.value === ""
                                                    ? null
                                                    : e.target.value,
                                        }));
                                    }}
                                    style={{
                                        width: "100%",
                                        borderRadius: 8,
                                        border: "1px solid #dbe3ee",
                                        padding: 8,
                                        fontSize: 15,
                                    }}
                                    disabled={
                                        !editing ||
                                        !(user && user.id === form.created_by)
                                    }
                                >
                                    <option value="">Unassigned</option>
                                    {userOptions &&
                                        userOptions.map((user) => (
                                            <option
                                                key={user.id}
                                                value={user.id}
                                            >
                                                {user.name}
                                            </option>
                                        ))}
                                </select>
                            ) : (
                                <div style={fieldValue}>
                                    {assignee?.name ||
                                        (form.assignee === null ||
                                        form.assignee === undefined
                                            ? "Unassigned"
                                            : form.assignee)}
                                </div>
                            )}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={fieldLabel}>Created by</div>
                            <div style={fieldValue}>
                                {creator?.name ||
                                    form.created_by ||
                                    "Unknown"}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Actions */}
                <div style={buttonRow}>
                    {!editing && (
                        <button style={buttonStyles} onClick={handleEdit}>
                            Edit
                        </button>
                    )}
                    {editing && (
                        <>
                            <button style={buttonStyles} onClick={handleSave}>
                                Save
                            </button>
                            <button
                                style={cancelButtonStyles}
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </>
                    )}
                    {!editing && (
                        <button
                            style={cancelButtonStyles}
                            onClick={onClose}
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
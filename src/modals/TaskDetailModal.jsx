import React, { useEffect, useRef, useState } from "react";

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

    return (
        <div
            style={{
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
            }}
        >
            <div
                ref={modalRef}
                style={{
                    background: "#fff",
                    padding: 32,
                    borderRadius: 16,
                    minWidth: 400,
                    maxWidth: 500,
                }}
            >
                <h2>Task Details</h2>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                    }}
                >
                    <label>
                        Title:
                        {editing ? (
                            <input
                                name="title"
                                value={form.title || ""}
                                onChange={handleChange}
                                disabled={
                                    !editing ||
                                    !(user && user.id === form.created_by)
                                }
                            />
                        ) : (
                            form.title
                        )}
                    </label>
                    <label>
                        Status:
                        {editing ? (
                            <select
                                name="status"
                                value={form.status || ""}
                                onChange={handleChange}
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
                            form.status
                        )}
                    </label>
                    <label>
                        Priority:
                        {editing ? (
                            <select
                                name="priority"
                                value={form.priority || ""}
                                onChange={handleChange}
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
                            form.priority
                        )}
                    </label>
                    <label>
                        Start Date:
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
                                disabled={true}
                            />
                        ) : form.start_date ? (
                            form.start_date.slice(0, 10)
                        ) : (
                            ""
                        )}
                    </label>
                    <label>
                        Due Date:
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
                                disabled={
                                    !editing ||
                                    !(user && user.id === form.created_by)
                                }
                            />
                        ) : form.due_date ? (
                            form.due_date.slice(0, 10)
                        ) : (
                            ""
                        )}
                    </label>
                    <label>
                        Description:
                        {editing ? (
                            <textarea
                                name="description"
                                value={form.description || ""}
                                onChange={handleChange}
                                disabled={
                                    !editing ||
                                    !(user && user.id === form.created_by)
                                }
                            />
                        ) : (
                            form.description
                        )}
                    </label>
                    <label>
                        Created by:
                        {
                            userOptions
                                        ? userOptions.find(
                                              (u) => u.id === form.created_by
                                          )?.name || ""
                                        : form.created_by || ""
                        }
                        {/* {editing ? 
                            <input
                                name="created_by"
                                readOnly
                                value={
                                    userOptions
                                        ? userOptions.find(
                                              (u) => u.id === form.created_by
                                          )?.name || ""
                                        : form.created_by || ""
                                }
                                disabled
                            />
                            :
                            userOptions
                                ? userOptions.find(
                                      (u) => u.id === form.created_by
                                  )?.name || form.created_by
                                : form.created_by} */}
                    </label>
                    <label>
                        Assignee:
                        {editing ? (
    <select
      name="assignee"
      value={
        form.assignee === null || form.assignee === undefined
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
      disabled={
        !editing ||
        !(user && user.id === form.created_by)
      }
    >
      <option value="">
        Unassigned
      </option>
      {userOptions &&
        userOptions.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
    </select>
  ) : userOptions ? (
                            userOptions.find((u) => u.id === form.assignee)
                                ?.name ||
                            (form.assignee === null ||
                            form.assignee === undefined
                                ? "Unassigned"
                                : form.assignee)
                        ) : form.assignee === null ||
                          form.assignee === undefined ? (
                            "Unassigned"
                        ) : (
                            form.assignee
                        )}
                    </label>
                </div>
                <div
                    style={{
                        marginTop: 24,
                        display: "flex",
                        gap: 8,
                        justifyContent: "flex-end",
                    }}
                >
                    {!editing && <button onClick={handleEdit}>Edit</button>}
                    {editing && (
                        <>
                            <button onClick={handleSave}>Save</button>
                            <button onClick={handleCancel}>Cancel</button>
                        </>
                    )}
                    {!editing && <button onClick={onClose}>Close</button>}
                </div>
            </div>
        </div>
    );
}

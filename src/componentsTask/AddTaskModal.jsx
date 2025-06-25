import React, { useState, useEffect, useRef } from "react";


//Adding a new task modal component
export default function AddTaskModal({
    open,
    onClose,
    onSave,
    userOptions,
    loggedInUser,
}) {
    const [form, setForm] = useState({
        title: "",
        description: "",
        status: "unassigned",
        start_date: null,
        end_date: null,
        due_date: null,
        priority: "Low",
        project_name: "",
        created_by: null,
        reporter: null,
        assignee: null,
    });

    const [error, setError] = useState("");

    const modalRef = useRef(null);

    useEffect(() => {
        if (open && loggedInUser) {
            setForm(f => ({ ...f, created_by: loggedInUser.id }));
        }
    }, [open, loggedInUser]);

    useEffect(() => {
        if (!open) return;

        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, onClose]);

    useEffect(() => {
        if (!open) {
            setForm({
                title: "",
                description: "",
                status: "unassigned",
                start_date: null,
                end_date: null,
                due_date: null,
                priority: "Low",
                project_name: "",
                created_by: loggedInUser?.id || null,
                reporter: null,
                assignee: null,
            });
            setError("");
        }
    }, [open, loggedInUser]);

    if (!open) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "assignee") {
            if (value) {
                setForm(f => ({
                    ...f,
                    assignee: value,
                    reporter: loggedInUser.id,
                    start_date: new Date().toISOString().slice(0, 10),
                    status: "pending",
                }));
            } else {
                setForm(f => ({
                    ...f,
                    assignee: null,
                    reporter: null,
                    start_date: null,
                    status: "unassigned",
                }));
            }
        } else {
            setForm(f => ({ ...f, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title.trim()) {
            setError("Title is required");
            return;
        }
        if (!form.project_name.trim()) {
            setError("Project Name is required");
            return;
        }
        setError("");
        //console.log("Form submitted:", form.created_by, form);
        onSave(form);
    };

    

    return (
        <div className="modal-backdrop" style={{
            position: "fixed", left: 0, top: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.3)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
            <div
                ref={modalRef}
                style={{
                    background: "#fff", borderRadius: 8, padding: 24, minWidth: 400, maxWidth: 500, position: "relative"
                }}>
                <h2>Add Task</h2>
                <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: 12}}>
                    <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
                    <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
                    <input name="project_name" placeholder="Project Name" value={form.project_name} onChange={handleChange} required />
                    <input
                        name="created_by"
                        type="text"
                        hidden
                        value={loggedInUser?.id || ""}
                        readOnly
                    />
                    <select name="priority" value={form.priority} onChange={handleChange}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                    <label style={{gap: 8, display: "flex", flexDirection: "column"}}>
                        Due Date
                        <input
                            type="date"
                            name="due_date"
                            placeholder="Due Date"
                            value={form.due_date || ""}
                            onChange={handleChange}
                        />
                    </label>
                    <select name="assignee" value={form.assignee} onChange={handleChange}>
                        <option value="">Select Assignee</option>
                        {userOptions.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                    {error && <div style={{color: "red"}}>{error}</div>}
                    <div style={{display: "flex", justifyContent: "flex-end", gap: 8}}>
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Add Task</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
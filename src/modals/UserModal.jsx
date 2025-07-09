import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "../components/Dashboard.css";
import SuccessModal from "./SuccessModal";
import ErrorModal from "./ErrorModal";

const roleOptions = ["User", "Admin", "Master"];

// Styles for UserModal
const userModalStyles = `
.user-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
}

.user-modal {
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    max-width: 800px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
}

.user-modal-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 24px;
    border-radius: 16px 16px 0 0;
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
}

.user-modal-content {
    padding: 24px;
}

.user-form-section {
    margin-bottom: 32px;
}

.user-form-section h4 {
    color: #374151;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid #e5e7eb;
}

.user-form-group {
    margin-bottom: 16px;
}

.user-form-group label {
    display: block;
    font-weight: 600;
    color: #374151;
    margin-bottom: 4px;
    font-size: 0.9rem;
}

.user-form-input {
    width: 100%;
    padding: 12px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

.user-form-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.user-form-input:disabled {
    background-color: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
}

.user-form-select {
    width: 100%;
    padding: 12px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 1rem;
    background-color: white;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

.user-form-select:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.user-form-select:disabled {
    background-color: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
}

.user-tasks-section {
    margin-top: 32px;
    border-top: 1px solid #e5e7eb;
    padding-top: 24px;
}

.user-tasks-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.user-tasks-title {
    color: #374151;
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
}

.user-tasks-count {
    background: #f3f4f6;
    color: #374151;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
}

.user-tasks-list {
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
}

.user-task-item {
    padding: 12px 16px;
    border-bottom: 1px solid #f3f4f6;
    transition: background-color 0.2s ease;
}

.user-task-item:last-child {
    border-bottom: none;
}

.user-task-item:hover {
    background-color: #f9fafb;
}

.user-task-title {
    font-weight: 600;
    color: #374151;
    margin-bottom: 4px;
    font-size: 0.95rem;
}

.user-task-details {
    display: flex;
    gap: 16px;
    font-size: 0.85rem;
    color: #6b7280;
}

.user-task-status {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: capitalize;
}

.user-task-status.pending {
    background: #fef3c7;
    color: #92400e;
}

.user-task-status.completed {
    background: #d1fae5;
    color: #065f46;
}

.user-task-status.in-progress {
    background: #dbeafe;
    color: #1e40af;
}

.user-task-priority {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: capitalize;
}

.user-task-priority.high {
    background: #fee2e2;
    color: #dc2626;
}

.user-task-priority.medium {
    background: #fef3c7;
    color: #d97706;
}

.user-task-priority.low {
    background: #d1fae5;
    color: #059669;
}

.user-modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
}

.user-modal-btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 100px;
}

.user-modal-btn.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.user-modal-btn.primary:hover {
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.user-modal-btn.secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
}

.user-modal-btn.secondary:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
}

.user-no-tasks {
    text-align: center;
    padding: 32px;
    color: #6b7280;
    font-style: italic;
}

.user-tasks-loading {
    text-align: center;
    padding: 32px;
    color: #6b7280;
}

@media (max-width: 768px) {
    .user-modal {
        width: 95%;
        margin: 10px;
    }
    
    .user-modal-content {
        padding: 16px;
    }
    
    .user-task-details {
        flex-direction: column;
        gap: 8px;
    }
    
    .user-modal-actions {
        flex-direction: column;
    }
    
    .user-modal-btn {
        width: 100%;
    }
}
`;

function UserModal({ myProfile, user, onClose, onSave }) {
    const [form, setForm] = useState(user || {});
    const [userTasks, setUserTasks] = useState([]);
    const [tasksLoading, setTasksLoading] = useState(false);
    const token = Cookies.get("jwt_token");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        setForm(user || {});

        // Fetch user's assigned tasks when modal opens
        if (user?.id) {
            fetchUserTasks(user.id);
        }
    }, [user]);

    const fetchUserTasks = async (userId) => {
        setTasksLoading(true);
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/filterTasks?assignee=${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setUserTasks(data.tasks || []);
            } else {
                console.error("Failed to fetch user tasks");
                setUserTasks([]);
            }
        } catch (error) {
            console.error("Error fetching user tasks:", error);
            setUserTasks([]);
        } finally {
            setTasksLoading(false);
        }
    };

    if (!user) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_URL}/updateUser/${user.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(form),
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) {
                    setError(
                        data.error ||
                            "An error occurred while updating the user."
                    );
                    return;
                }
                setSuccess("User details updated successfully!");
                setTimeout(() => {
                    onSave(data);
                }, 1500);
            })
            .catch((err) => {
                setError("Network error: " + err.message);
            });
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Not set";
        return new Date(dateString + "T00:00:00").toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <>
            <style>{userModalStyles}</style>
            <div className="user-modal-backdrop" onClick={onClose}>
                <div
                    className="user-modal"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h3 className="user-modal-header">Edit User Details</h3>

                    <div className="user-modal-content">
                        <div className="user-form-section">
                            <h4>Personal Information</h4>
                            <form onSubmit={handleSubmit}>
                                <div className="user-form-group">
                                    <label>ID:</label>
                                    <input
                                        type="text"
                                        value={form.id}
                                        disabled
                                        className="user-form-input"
                                    />
                                </div>
                                <div className="user-form-group">
                                    <label>Name:</label>
                                    <input
                                        name="name"
                                        value={form.name || ""}
                                        onChange={handleChange}
                                        disabled={myProfile?.post === "User"}
                                        className="user-form-input"
                                    />
                                </div>
                                <div className="user-form-group">
                                    <label>Email:</label>
                                    <input
                                        name="email"
                                        value={form.email || ""}
                                        onChange={handleChange}
                                        disabled={myProfile?.post === "User"}
                                        className="user-form-input"
                                    />
                                </div>
                                <div className="user-form-group">
                                    <label>Role:</label>
                                    <select
                                        name="post"
                                        value={form.post || roleOptions[0]}
                                        onChange={handleChange}
                                        disabled={myProfile?.post === "User"}
                                        className="user-form-select"
                                    >
                                        {roleOptions.map((role) => (
                                            <option key={role} value={role}>
                                                {role.charAt(0).toUpperCase() +
                                                    role.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </form>
                        </div>

                        {/* User's Assigned Tasks Section */}
                        <div className="user-tasks-section">
                            <div className="user-tasks-header">
                                <h4 className="user-tasks-title">
                                    Assigned Tasks
                                </h4>
                                <span className="user-tasks-count">
                                    {userTasks.length} task
                                    {userTasks.length !== 1 ? "s" : ""}
                                </span>
                            </div>

                            <div className="user-tasks-list">
                                {tasksLoading ? (
                                    <div className="user-tasks-loading">
                                        Loading tasks...
                                    </div>
                                ) : userTasks.length === 0 ? (
                                    <div className="user-no-tasks">
                                        No tasks assigned to this user
                                    </div>
                                ) : (
                                    userTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="user-task-item"
                                        >
                                            <div className="user-task-title">
                                                {task.title}
                                            </div>
                                            <div className="user-task-details">
                                                <span
                                                    className={`user-task-status ${task.status?.toLowerCase()}`}
                                                >
                                                    {task.status}
                                                </span>
                                                <span
                                                    className={`user-task-priority ${task.priority?.toLowerCase()}`}
                                                >
                                                    {task.priority} Priority
                                                </span>
                                                <span>
                                                    Due:{" "}
                                                    {formatDate(task.due_date)}
                                                </span>
                                                {task.project_name && (
                                                    <span>
                                                        Project:{" "}
                                                        {task.project_name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="user-modal-actions">
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                hidden={myProfile?.post === "User"}
                                className="user-modal-btn primary"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="user-modal-btn secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>

                    <ErrorModal
                        open={!!error}
                        message={error}
                        onClose={() => setError("")}
                    />
                    <SuccessModal
                        open={!!success}
                        message={success}
                        onClose={() => setSuccess("")}
                    />
                </div>
            </div>
        </>
    );
}

export default UserModal;

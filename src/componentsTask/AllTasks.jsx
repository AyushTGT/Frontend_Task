import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import "../components/Dashboard.css";
import axios from "axios";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import AddTaskModal from "../modals/AddTaskModal";
import TaskDetailModal from "../modals/TaskDetailModal";
import ErrorModal from "../modals/ErrorModal";

//task page listing same as user listing with search paramters and filters

export default function AllTasks() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        per_page: 20,
        total: 0,
        last_page: 1,
    });
    const [search, setSearch] = useState("");
    // const [postFilter, setPostFilter] = useState("");
    const [sortField, setSortField] = useState("title");
    const [sortOrder, setSortOrder] = useState("asc");

    // const [selectedUsers, setSelectedUsers] = useState([]);
    // const [modalUser, setModalUser] = useState(null);
    // const [modalUserAdd, setModalUserAdd] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");
    // const [profileModal, setProfileModal] = useState(false);
    const [myProfile, setMyProfile] = useState(null);
    const token = Cookies.get("jwt_token");
    const searchTimeout = useRef(null);
    const [addTaskOpen, setAddTaskOpen] = useState(false);
    const [error, setError] = useState("");

    // New states for dropdown filters
    const [reporterOptions, setReporterOptions] = useState([]);
    const [assignedByOptions, setAssignedByOptions] = useState([]);
    const [assigneeOptions, setAssigneeOptions] = useState([]);
    const [reporterFilter, setReporterFilter] = useState("");
    const [assignedByFilter, setAssignedByFilter] = useState("");
    const [assigneeFilter, setAssigneeFilter] = useState("");
    const [selectedPriority, setSelectedPriority] = useState("");
    const [modalTask, setModalTask] = useState(null);
    const [taskDetailOpen, setTaskDetailOpen] = useState(false);
    const [dueDateStart, setDueDateStart] = useState("");
    const [dueDateEnd, setDueDateEnd] = useState("");

    useEffect(() => {
        axios
            .get("http://localhost:8000/userName", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setReporterOptions(res.data);
                setAssignedByOptions(res.data);
                setAssigneeOptions(res.data);
            })
            .catch(() => {});
    }, [token]);

    function fetchUsers({
        page = pagination.page,
        per_page = pagination.per_page,
    } = {}) {
        const rparams = {
            status: selectedStatus,
            priority: selectedPriority,
            search,
            sort: sortField,
            order: sortOrder,
            per_page,
            // post: postFilter,
            page,
            reporter: reporterFilter,
            created_by: assignedByFilter,
            assignee: assigneeFilter,
            due_date_start: dueDateStart,
            due_date_end: dueDateEnd,
        };
        const filteredParams = Object.fromEntries(
            Object.entries(rparams).filter(
                ([_, v]) => v !== undefined && v !== null && v !== ""
            )
        );

        const params = new URLSearchParams(filteredParams);

        fetch(`http://localhost:8000/filterTasks?${params.toString()}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (res.status === 401) {
                    setError("Session expired. Please log in again.");
                    window.location.href = "/login";
                    return;
                }
                return res.json();
            })
            .then((data) => {
                if (!data) return;
                setUsers(data.tasks || []);
                //console.log(users);
                setPagination({
                    page: data.current_page,
                    per_page: data.per_page,
                    total: data.total,
                    last_page: data.last_page,
                });
            });
    }

    // Profile fetch (unchanged)
    const fetchProfile = () => {
        fetch(`http://localhost:8000/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (res.status === 401) {
                    setError("Session ended. Please log in again.");
                    window.location.href = "/login";
                    return null;
                }
                return res.json();
            })
            .then((data) => {
                if (data) setMyProfile(data);
            });
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(() => {
            fetchUsers();
        }, 500);

        return () => clearTimeout(searchTimeout.current);
    }, [search]);

    useEffect(() => {
        fetchUsers();
    }, [
        selectedStatus,
        selectedPriority,
        reporterFilter,
        assignedByFilter,
        assigneeFilter,
        // postFilter,
        // selectedStatus,
        sortField,
        sortOrder,
        pagination.page,
        pagination.per_page,
        dueDateStart,
        dueDateEnd,
    ]);

    const handleSort = (field) => {
        if (sortField === field)
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    // const handleSelectUser = (id) => {
    //     setSelectedUsers((prev) =>
    //         prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    //     );
    // };

    // const handleSelectAll = (checked) => {
    //     setSelectedUsers(checked ? users.map((u) => u.id) : []);
    // };

    // Logout handler (unchanged, add as needed)
    // const handleLogout = () => {
    //     fetch("http://localhost:8000/logout", {
    //         method: "POST",
    //         headers: { Authorization: `Bearer ${token}` },
    //     }).then(() => {
    //         Cookies.remove("jwt_token");
    //         window.location.href = "/login";
    //     });
    // };

    const handleRowClick = (task) => {
        setModalTask(task);
        setTaskDetailOpen(true);
    };

    //clear filter handler
    const handleClearFilter = () => {
        setSearch("");
        setSelectedStatus("");
        setSelectedPriority("");
        setSortField("title");
        setSortOrder("asc");
        // setSelectedUsers([]);
        setReporterFilter("");
        setAssignedByFilter("");
        setAssigneeFilter("");
        setDueDateStart(""); // add this
        setDueDateEnd("");
        setPagination({ page: 1, per_page: 20, total: 0, last_page: 1 });
    };

    const handleTaskUpdate = async (updatedTask) => {
        try {
            await axios.put(
                `http://localhost:8000/updateTask/${updatedTask.id}`,
                updatedTask,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setTaskDetailOpen(false);
            fetchUsers();
        } catch (err) {
            setError(
                "Error updating task: " +
                    (err.response?.data?.message || err.message)
            );
        }
    };

    // UI
    return (
        <div 
            
            style={{ flex: 1, background: "#f5f6fa", padding: "24px" }}
        >
            <Header user={myProfile} />
            <div>
                <div
                    class="filters-container"
                >
                    <input
                        placeholder="Search task"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        class="search-input"
                    />
                    <select
                        value={reporterFilter}
                        class="select-input"
                        onChange={(e) => setReporterFilter(e.target.value)}
                    >
                        <option value="">All Reporters</option>
                        {reporterOptions.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={assignedByFilter}
                        class="select-input"
                        onChange={(e) => setAssignedByFilter(e.target.value)}
                    >
                        <option value="">All Assigned By</option>
                        {assignedByOptions.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedStatus}
                        class="select-input"
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="unassigned">Unassigned</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <select
                        value={selectedPriority}
                        class="select-input"
                        onChange={(e) => setSelectedPriority(e.target.value)}
                    >
                        <option value="">All Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <select
                        value={assigneeFilter}
                        class="select-input"
                        onChange={(e) => setAssigneeFilter(e.target.value)}
                    >
                        <option value="">All Assignees</option>
                        {assigneeOptions.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={dueDateStart}
                        class="search-input"
                        onChange={(e) => setDueDateStart(e.target.value)}
                        placeholder="Due date start"
                        style={{ minWidth: 120 }}
                    />
                    <input
                        type="date"
                        value={dueDateEnd}
                        class="search-input"
                        onChange={(e) => setDueDateEnd(e.target.value)}
                        placeholder="Due date end"
                        style={{ minWidth: 120 }}
                    />

                    <button class="add-user-btn" onClick={() => setAddTaskOpen(true)}>
                        Add Task
                    </button>
                    <button class="clear-filter-btn" onClick={handleClearFilter}>Clear Filter</button>
                </div>

                <div
                    class="users-pagination"
                >
                    <button
                        onClick={() =>
                            setPagination((p) => ({ ...p, page: 1 }))
                        }
                        disabled={pagination.page === 1}
                    >
                        {"<<"}
                    </button>
                    <button
                        onClick={() =>
                            setPagination((p) => ({
                                ...p,
                                page: Math.max(1, p.page - 1),
                            }))
                        }
                        disabled={pagination.page === 1}
                    >
                        Previous
                    </button>
                    <span style={{ margin: "0 1em" }}>
                        Page {pagination.page} of {pagination.last_page}
                    </span>
                    <button
                        onClick={() =>
                            setPagination((p) => ({
                                ...p,
                                page: Math.min(p.last_page, p.page + 1),
                            }))
                        }
                        disabled={pagination.page === pagination.last_page}
                    >
                        Next
                    </button>
                    <button
                        onClick={() =>
                            setPagination((p) => ({ ...p, page: p.last_page }))
                        }
                        disabled={pagination.page === pagination.last_page}
                    >
                        {">>"}
                    </button>
                    <select
                        value={pagination.per_page}
                        onChange={(e) =>
                            setPagination((p) => ({
                                ...p,
                                per_page: parseInt(e.target.value),
                                page: 1,
                            }))
                        }
                    >
                        {[10, 20, 50, 100].map((n) => (
                            <option key={n} value={n}>
                                {n} / page
                            </option>
                        ))}
                    </select>
                    <span>
                        Go to page:{" "}
                        <input
                            type="number"
                            min="1"
                            max={pagination.last_page}
                            value={pagination.page}
                            onChange={(e) =>
                                setPagination((p) => ({
                                    ...p,
                                    page: Math.max(
                                        1,
                                        Math.min(
                                            p.last_page,
                                            Number(e.target.value)
                                        )
                                    ),
                                }))
                            }
                            style={{ width: 50 }}
                        />
                    </span>
                </div>

                <table
                    border="1"
                    cellPadding="8"
                    style={{ width: "100%", borderCollapse: "collapse" }}
                    class="users-table"
                >
                    <thead>
                        <tr>
                            {[
                                { key: "title", label: "Task Title" },
                                { key: "status", label: "Status" },
                                { key: "start_date", label: "Start Date" },
                                { key: "due_date", label: "Due Date" },
                                { key: "priority", label: "Priority" },
                                { key: "project_name", label: "Project" },
                                { key: "created_by", label: "Created By" },
                                { key: "reporter", label: "Reporter" },
                                { key: "assignee", label: "Assignee" },
                            ].map((col) => (
                                <th
                                    key={col.key}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleSort(col.key)}
                                >
                                    {col.label}
                                    {sortField === col.key
                                        ? sortOrder === "asc"
                                            ? " ▲"
                                            : " ▼"
                                        : " ▲▼"}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                // style={{

                                //     background: selectedUsers.includes(user.id)
                                //         ? "#eef"
                                //         : undefined,
                                // }}
                                onClick={() => handleRowClick(user)}
                            >
                                <td>{user.title}</td>
                                <td>{user.status}</td>
                                <td>
                                    {user.start_date
                                        ? new Date(
                                              user.start_date
                                          ).toLocaleDateString()
                                        : ""}
                                </td>
                                <td>
                                    {user.due_date
                                        ? new Date(
                                              user.due_date
                                          ).toLocaleDateString()
                                        : ""}
                                </td>
                                <td>
                                    <span
                                        className={`priority-tag ${
                                            user.priority === "high"
                                                ? "priority-high"
                                                : user.priority === "medium"
                                                ? "priority-medium"
                                                : "priority-low"
                                        }`}
                                    >
                                        {user.priority}
                                    </span>
                                </td>
                                <td>{user.project_name}</td>
                                <td>
                                    {reporterOptions.find(
                                        (u) => u.id === user.created_by
                                    )?.name || user.created_by}
                                </td>

                                <td>
                                    {reporterOptions.find(
                                        (u) => u.id === user.reporter
                                    )?.name || user.reporter}
                                </td>

                                <td>
                                    {reporterOptions.find(
                                        (u) => u.id === user.assignee
                                    )?.name || user.assignee}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination controls */}

                {/* <UserModal
                    user={modalUser}
                    onClose={() => setModalUser(null)}
                    onSave={(updatedUser) => {
                        setModalUser(null);
                        fetchUsers();
                    }}
                />

                <UserModalAdd
                    user={modalUserAdd}
                    onClose={() => setModalUserAdd(null)}
                    onSave={(updatedUser) => {
                        setModalUserAdd(null);
                        fetchUsers();
                    }}
                /> */}

                <AddTaskModal
                    open={addTaskOpen}
                    onClose={() => {
                        setAddTaskOpen(false);
                    }}
                    userOptions={reporterOptions}
                    loggedInUser={myProfile}
                    onSave={async (form) => {
                        try {
                            await axios.post(
                                "http://localhost:8000/addTask",
                                form,
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            );
                            setAddTaskOpen(false);
                            fetchUsers();
                            //resetForm(); // Call resetForm if provided
                        } catch (err) {
                            //console.error("Error adding task:", err);
                            setError(
                                "Error adding task: " +
                                    (err.response?.data?.message || err.message)
                            );
                        }
                    }}
                />
                {/* try {
                            await axios.post(
                                "http://localhost:8000/addTask",
                                form,
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            );
                            setAddTaskOpen(false);
                            fetchUsers();
                        } catch (err) {
                            alert(
                                "Error adding task: " +
                                    (err.response?.data?.message || err.message)
                            );
                        }
                    }}
                /> */}

                <ErrorModal
                    open={!!error}
                    message={error}
                    onClose={() => setError("")}
                />

                <TaskDetailModal
                    open={taskDetailOpen}
                    onClose={() => setTaskDetailOpen(false)}
                    task={modalTask}
                    onUpdate={handleTaskUpdate}
                    userOptions={reporterOptions}
                    user={myProfile}
                />
            </div>
        </div>
    );
}

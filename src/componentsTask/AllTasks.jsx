import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../components/Dashboard.css";
import Header from "./Header";
import AddTaskModal from "../modals/AddTaskModal";
import TaskDetailModal from "../modals/TaskDetailModal";
import ErrorModal from "../modals/ErrorModal";
import SuccessModal from "../modals/SuccessModal";

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
    const [sortField, setSortField] = useState("title");
    const [sortOrder, setSortOrder] = useState("asc");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [myProfile, setMyProfile] = useState(null);
    const token = Cookies.get("jwt_token");
    const searchTimeout = useRef(null);
    const [addTaskOpen, setAddTaskOpen] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
    const [dueDateEnd, setDueDateEnd] = useState("")
    

    const getStatusClass = (status) => {
        const statusLower = status?.toLowerCase();
        switch(statusLower) {
            case 'pending':
                return 'status-pending';
            case 'completed':
                return 'status-completed';
            case 'unassigned':
                return 'status-unassigned';
            case 'cancelled':
                return 'status-cancelled';
            case 'overdue':
                return 'status-overdue';
            default:
                return 'status-default';
        }
    };

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/userName`, {
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

        fetch(`${process.env.REACT_APP_API_URL}/filterTasks?${params.toString()}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (res.status === 401) {
                    setError("Session expired. Please log in again.");
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 5000);
                    
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
        fetch(`${process.env.REACT_APP_API_URL}/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (res.status === 401) {
                    setError("Session ended. Please log in again.");
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 5000);
                    
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

    //Debouncing the search input
    // This will wait for 500ms after the user stops typing before fetching users
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
        sortField,
        sortOrder,
        pagination.page,
        pagination.per_page,
        dueDateStart,
        dueDateEnd,
    ]);

    // Sorting handler
    // This function toggles the sort order for a field or sets it to ascending if a different field is clicked
    const handleSort = (field) => {
        if (sortField === field)
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    //Clicking a row to open task detail modal
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
        setReporterFilter("");
        setAssignedByFilter("");
        setAssigneeFilter("");
        setDueDateStart("");
        setDueDateEnd("");
        setPagination({ page: 1, per_page: 20, total: 0, last_page: 1 });
    };

    const handleTaskUpdate = async (updatedTask) => {
        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/updateTask/${updatedTask.id}`,
                updatedTask,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setTaskDetailOpen(false);
            fetchUsers();
            setSuccess("Task updated successfully!");
        } catch (err) {
            setError(
                "Error updating task: " +
                    (err.response?.data?.message || err.message)
            );
        }
    };
    const selectOptions = [
        { value: "", label: "All Reporters" },
        ...reporterOptions.map((user) => ({
            value: user.id,
            label: user.name,
        })),
    ];

    // UI
    return (
        <div className="apple">
            <Header user={myProfile} />
            <div>
                <div className="filters-container">
                    <input
                        placeholder="Search task"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                    <select
                        value={reporterFilter}
                        className="select-input"
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
                        className="select-input"
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
                        className="select-input"
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
                        className="select-input"
                        onChange={(e) => setSelectedPriority(e.target.value)}
                    >
                        <option value="">All Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <select
                        value={assigneeFilter}
                        className="select-input"
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
                        className="search-input"
                        onChange={(e) => setDueDateStart(e.target.value)}
                        placeholder="Due date start"
                        style={{ minWidth: 120 }}
                    />
                    <input
                        type="date"
                        value={dueDateEnd}
                        className="search-input"
                        onChange={(e) => setDueDateEnd(e.target.value)}
                        placeholder="Due date end"
                        style={{ minWidth: 120 }}
                    />

                    <button
                        className="add-user-btn"
                        onClick={() => setAddTaskOpen(true)}
                    >
                        Add Task
                    </button>
                    <button
                        className="clear-filter-btn"
                        onClick={handleClearFilter}
                    >
                        Clear Filter
                    </button>
                </div>

                <div className="users-pagination">
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
                    className="users-table"
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
                                onClick={() => handleRowClick(user)}
                            >
                                <td>{user.title}</td>
                                <td>
                                    <span className={getStatusClass(user.status)}>
                                        {user.status}
                                    </span>
                                </td>
                                <td>
                                    {user.start_date
                                        ? new Date(user.start_date + 'T00:00:00').toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })
                                        : ""}
                                </td>
                                <td >
                                   { user.due_date}
                                </td>
                                <td>
                                    <span
                                        className={`priority-tag ${
                                            user.priority === "High"
                                                ? "priority-high"
                                                : user.priority === "Medium"
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
                                `${process.env.REACT_APP_API_URL}/addTask`,
                                form,
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            );
                            setAddTaskOpen(false);
                            fetchUsers();
                            setSuccess("Task added successfully!");
                        } catch (err) {
                            setError(
                                "Error adding task: " +
                                    (err.response?.data?.message || err.message)
                            );
                        }
                    }}
                />
                
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

                <SuccessModal
                    open={!!success}
                    message={success}
                    onClose={() => setSuccess("")}
                />

            </div>
        </div>
    );
}

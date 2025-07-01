import React, { use, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import "./Dashboard.css";
import UserModal from "../modals/UserModal.jsx";
import UserModalAdd from "../modals/UserModalAdd.jsx";
import Header from "./HeaderDashboard.jsx";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { connect } from "react-redux";
import { fetchProfile } from "../redux/profileActions";
import ErrorModal from "../modals/ErrorModal.jsx";
import { getUsers, getProfile } from "../apis/userapis.jsx";

function Dashboard({ myProfile1 }) {
    console.log({ myProfile1 });
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        per_page: 20,
        total: 0,
        last_page: 1,
    });
    const [search, setSearch] = useState("");
    const [postFilter, setPostFilter] = useState("");
    const [sortField, setSortField] = useState("id");
    const [sortOrder, setSortOrder] = useState("asc");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [modalUser, setModalUser] = useState(null);
    const [modalUserAdd, setModalUserAdd] = useState(null);
    const [selectedRole, setSelectedRole] = useState("User");
    const [profileModal, setProfileModal] = useState(false);
    const [myProfile, setMyProfile] = useState(null);
    const token = Cookies.get("jwt_token");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const searchTimeout = useRef(null);

    // Getting the users from the backend with the applied parameters
    function fetchUsers({
        page = pagination.page,
        per_page = pagination.per_page,
    } = {}) {
        getUsers({
            search,
            sort: sortField,
            order: sortOrder,
            per_page,
            post: postFilter,
            page,
        })
            .then((data) => {
                if (!data) return;
                setUsers(data.data || []);
                setPagination({
                    page: data.current_page,
                    per_page: data.per_page,
                    total: data.total,
                    last_page: data.last_page,
                });
            })
            .catch((error) => {
                //In case jwt token is expired or any other error
                if (error.message === "SessionExpired") {
                    setError("Session expired. Please log in again.");
                    window.location.href = "/login";
                } else {
                    setError("An error occurred while fetching users.");
                }
            });
    }

    // Fetching the profile of the logged-in user
    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const data = await getProfile(token);
            setMyProfile(data);
        } catch (error) {
            setError("Could not load profile.");
        } finally {
            setIsLoading(false);
        }
    };

    // const dispatch = useDispatch();
    // useEffect(() => {
    //     dispatch(fetchProfile());
    // }, [dispatch]);

    // Fetch profile on mount
    useEffect(() => {
        fetchProfile();
    }, []);

    // Set cookie only when not loading and profile is available
    useEffect(() => {
        if (!isLoading && myProfile?.id) {
            Cookies.set("userid", myProfile.id);
            console.log(myProfile1);
        }
    }, [isLoading, myProfile1]);

    //Download users data as CSV by calling the backend API and the appropriate params
    const exportToCSV = ({ search, postFilter, sortField, sortOrder }) => {
        const params = new URLSearchParams({
            search,
            post: postFilter,
            sort: sortField,
            order: sortOrder,
        }).toString();
        const url = `http://localhost:8000/exportCSV?${params}`;

        fetch(url, {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok)
                    throw new Error("No users found or error in downloading.");
                return response.blob();
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "users.csv");
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            })
            .catch((error) => {
                setError(error.message);
                console.error(error);
            });
    };

    //debouncing the search input
    useEffect(() => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(() => {
            fetchUsers();
        }, 500);

        return () => clearTimeout(searchTimeout.current);
    }, [search]);

    // Fetch users whenever filters, sorting, or pagination changes
    useEffect(() => {
        fetchUsers();
    }, [
        postFilter,
        sortField,
        sortOrder,
        pagination.page,
        pagination.per_page,
    ]);

    // Handle sorting by field
    const handleSort = (field) => {
        if (sortField === field)
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    // Handle selecting or unselect a user using the checkbox
    const handleSelectUser = (id) => {
        setSelectedUsers((prev) =>
            prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
        );
    };

    // Handle selecting all users
    const handleSelectAll = (checked) => {
        //setSelectedUsers(checked ? users.map((u) => u.id) : []);
        setSelectedUsers(
        checked
            ? users
                .filter((u) => u.deleted_by === null) // Only include users not deleted
                .map((u) => u.id)
            : []
    );
    };

    // Handle delete user with confirmation
    const handleDeleteUser = (id) => {
        if (!window.confirm("Are you sure you want to delete this user?"))
            return;
        fetch(`http://localhost:8000/delUser/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        }).then(() => fetchUsers());
    };

    // Handle bulk delete of selected users with confirmation
    const handleBulkDelete = () => {
        if (!window.confirm("Delete selected users?")) return;

        fetch("http://localhost:8000/bulkDelete", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ids: selectedUsers }),
        })
            .then((res) =>
                res.json().then((data) => ({ status: res.status, data }))
            )
            .then(({ status, data }) => {
                setError(data.message);
                //alert(data.message || "Unknown response");
                if (status === 200) {
                    setSelectedUsers([]);
                    fetchUsers();
                }
            })
            .catch((err) => {
                setError("Bulk delete failed.");
            });
    };

    // Handle bulk role change of selected users with confirmation
    const handleBulkRole = () => {
        if (!selectedRole) {
            setError("Please select a role.");
            return;
        }
        if (!window.confirm("Change Roles of selected Users?")) return;

        fetch("http://localhost:8000/bulkRole", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ids: selectedUsers, role: selectedRole }),
        })
            .then((res) =>
                res.json().then((data) => ({ status: res.status, data }))
            )
            .then(({ status, data }) => {
                if (status === 200) {
                    // setError(data.message || "Users role changed.");
                    setSelectedUsers([]);
                    fetchUsers();
                } else {
                    setError(data.error || "Failed to change user roles.");
                }
            })
            .catch((err) => {
                setError("Bulk role assign failed. " + err.message);
            });
    };

    //logout function
    const handleLogout = () => {
        fetch("http://localhost:8000/logout", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        }).then(() => {
            Cookies.remove("jwt_token");
            window.location.href = "/login";
        });
    };

    // Handle clearing all filters and resetting state
    const handleClearFilter = () => {
        setSearch("");
        setPostFilter("");
        setSortField("id");
        setSortOrder("asc");
        setSelectedUsers([]);
        setPagination({ page: 1, per_page: 20, total: 0, last_page: 1 });
    };

    return (
        <div style={{ flex: 1, background: "#f5f6fa", padding: "24px" }} >
            <Header user={myProfile} />
            <div>
                <div
                    class="filters-container"
                >
                    {/* Search and filter */}
                    <input
                        placeholder="Search name/email"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        class="search-input"
                    />
                    <select
                        value={postFilter}
                        onChange={(e) => setPostFilter(e.target.value)}
                        class="select-input"
                    >
                        <option value="">All Posts</option>
                        <option value="Master">Master</option>
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                    </select>

                    {/* Main actions */}
                    
                    <button
                        onClick={() => setModalUserAdd({})}
                        class="add-user-btn"
                        disabled={ myProfile?.post === "User" }
                       
                    >
                        Add User
                    </button>

                    <button
                        onClick={handleClearFilter}
                        class="clear-filter-btn"
                    >
                        Clear Filter
                    </button>
                    <button
                        onClick={() =>
                            exportToCSV({
                                search,
                                postFilter,
                                sortField,
                                sortOrder,
                            })
                        }
                        class="export-csv-btn"
                    >
                        Export CSV
                    </button>

                    {/* Divider for bulk actions */}
                    {myProfile?.post !== "User" && selectedUsers.length > 0 && (
                        <div
                            class="btn-container"
                        >
                            <button
                                onClick={handleBulkDelete}
                                class="bulk-delete-btn"
                                disabled={myProfile?.post !== "Master"}
                            >
                                Delete Selected
                            </button>
                            <select
                                value={selectedRole}
                                onChange={(e) =>
                                    setSelectedRole(e.target.value)
                                }
                                class="select-input"
                            >
                                <option value="" disabled>
                                    Select Role
                                </option>
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                                <option value="Master">Master</option>
                            </select>
                            <button
                                onClick={handleBulkRole}
                                class="export-csv-btn"
                                disabled={
                                    !selectedRole || myProfile?.post === "User"
                                }
                            >
                                Change Role
                            </button>
                        </div>
                    )}
                </div>

                {/* pagination control */}
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
                    border="1px solid black"
                    class="users-table"
                >
                    <thead>
                        <tr>
                            <th hidden={myProfile?.post === "User"}>
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.length === users.filter(u => u.deleted_by === null).length}

                                    onChange={(e) =>
                                        handleSelectAll(e.target.checked)
                                    }
                                />
                            </th>
                            {[
                                { key: "id", label: "ID" },
                                { key: "name", label: "Name" },
                                { key: "email", label: "Email" },
                                { key: "created_at", label: "Created At" },
                                { key: "post", label: "Role" },
                                {
                                    key: "verify",
                                    label: "Verified",
                                    sortable: false,
                                },
                                {
                                    key: "status",
                                    label: "Status",
                                    sortable: false,
                                },
                                {
                                    key: "online",
                                    label: "Online",
                                    sortable: false,
                                },
                            ].map((col) => (
                                <th
                                    key={col.key}
                                    style={{
                                        cursor:
                                            col.sortable === false
                                                ? "default"
                                                : "pointer",
                                    }}
                                    onClick={
                                        col.sortable === false
                                            ? undefined
                                            : () => handleSort(col.key)
                                    }
                                >
                                    {col.label}
                                    {col.sortable === false
                                        ? null
                                        : sortField === col.key
                                        ? sortOrder === "asc"
                                            ? " ▲"
                                            : " ▼"
                                        : " ▲▼"}
                                </th>
                            ))}
                            {myProfile?.post !== "User" && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                style={{
                                    background: selectedUsers.includes(user.id)
                                        ? "#eef"
                                        : undefined,
                                }}
                                onClick={() => setModalUser(user)}
                            >
                                <td hidden={myProfile?.post === "User"}>
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(
                                            user.id
                                        )}
                                        disabled={user.deleted_by !== null}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            handleSelectUser(user.id);
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </td>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    {new Date(user.created_at).toLocaleString()}
                                </td>
                                <td>{user.post}</td>
                                <td>
                                    {user.email_verified_at ? (
                                        <span style={{ color: "green" }}>
                                            ✔
                                        </span>
                                    ) : (
                                        <div>
                                            <span style={{ color: "red" }}>
                                                ✘
                                            </span>
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <span
                                        style={{
                                            padding: "2px 6px",
                                            borderRadius: 4,
                                            background:
                                                user.deleted_by === null
                                                    ? "#d4f7d4"
                                                    : "#f7d4d4",
                                        }}
                                    >
                                        {user.deleted_by !== null
                                            ? "Deactivated"
                                            : "Active"}
                                    </span>
                                </td>
                                <td>
                                    {user.last_logout === null ? (
                                        <span style={{ color: "green" }}>
                                            Online
                                        </span>
                                    ) : (
                                        <span style={{ color: "red" }}>
                                            Offline
                                        </span>
                                    )}
                                </td>
                                {myProfile?.post !== "User" && (
                                    <td>
                                        <button
                                            className="user-action-btn edit-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setModalUser(user);
                                            }}
                                            title={
                                                user.deleted_by !== null
                                                    ? "User no more available"
                                                    : ""
                                            }
                                            disabled={
                                                user.deleted_by !== null ||
                                                myProfile?.post === "User"
                                            }
                                        >
                                            {user.deleted_by !== null
                                                ? "User Unavailable"
                                                : myProfile?.post === "User"
                                                ? "You can't Edit"
                                                : "Edit"}
                                        </button>
                                        <button
                                            className="user-action-btn delete-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteUser(user.id);
                                            }}
                                            disabled={
                                                user.deleted_by !== null ||
                                                myProfile?.post !== "Master" ||
                                                user.post === "Master" ||
                                                user.id === myProfile.id
                                            }
                                        >
                                            {user.id === myProfile.id
                                                ? "Can't Delete Self"
                                                : user.deleted_by !== null
                                                ? "User Unavailable"
                                                : myProfile?.post !== "Master"
                                                ? "You can't Delete"
                                                : user.post === "Master"
                                                ? "Master can't be deleted"
                                                : "Delete"}
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal */}             

                <UserModal
                    myProfile={myProfile}
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
                />

                <ErrorModal
                    open={!!error}
                    message={error}
                    onClose={() => setError("")}
                />
            </div>
        </div>
    );
}

export default connect(
    (state) => {
        return {
            myProfile1: state.profile.myProfile,
        };
    },
    { fetchProfile }
)(Dashboard);

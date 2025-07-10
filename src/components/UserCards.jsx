import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { connect } from "react-redux";
import "./Dashboard.css";
import "./UserCards.css"; // New CSS file for cards
import UserModal from "../modals/UserModal.jsx";
import UserModalAdd from "../modals/UserModalAdd.jsx";
import Header from "./HeaderDashboard.jsx";
import { fetchProfile } from "../redux/profileActions";
import ErrorModal from "../modals/ErrorModal.jsx";
import { getUsers, getProfile } from "../apis/userapis.jsx";
import SuccessModal from "../modals/SuccessModal.jsx";

function UserCards({ myProfile1 }) {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        per_page: 6, // Changed to 12 for better card layout
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

    const [myProfile, setMyProfile] = useState(null);
    const [isUserView, setIsUserView] = useState(false);
    const token = Cookies.get("jwt_token");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const searchTimeout = useRef(null);

    const effectiveUserRole =
        isUserView && myProfile?.post === "Master" ? "User" : myProfile?.post;

    // All your existing functions remain the same...
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
                setUsers(data?.data || []);
                setPagination({
                    page: data.current_page,
                    per_page: data.per_page,
                    total: data.total,
                    last_page: data.last_page,
                });
            })
            .catch((error) => {
                if (error.message === "SessionExpired") {
                    setError("Session expired. Please log in again.");
                    Cookies.remove("jwt_token");
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 500);
                } else {
                    setError("An error occurred while fetching users.");
                }
            });
    }

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

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (!isLoading && myProfile?.id) {
            Cookies.set("userid", myProfile?.id);
        }
    }, [isLoading, myProfile1]);

    const handleViewToggle = () => {
        setIsUserView(!isUserView);
        setSelectedUsers([]);
    };

    const exportToCSV = ({ search, postFilter, sortField, sortOrder }) => {
        const params = new URLSearchParams({
            search,
            post: postFilter,
            sort: sortField,
            order: sortOrder,
        }).toString();
        const url = `${process.env.REACT_APP_API_URL}/exportCSV?${params}`;

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
                setSuccess("CSV downloaded successfully.");
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    useEffect(() => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(searchTimeout.current);
    }, [search]);

    useEffect(() => {
        fetchUsers();
    }, [postFilter, sortField, sortOrder, pagination.page, pagination.per_page]);

    const handleSort = (field) => {
        if (sortField === field)
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const handleSelectUser = (id) => {
        setSelectedUsers((prev) =>
            prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (checked) => {
        setSelectedUsers(
            checked
                ? users.filter((u) => u.deleted_by === null).map((u) => u.id)
                : []
        );
    };

    const handleDeleteUser = (id) => {
        if (!window.confirm("Are you sure you want to delete this user?"))
            return;
        fetch(`${process.env.REACT_APP_API_URL}/delUser/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || "Failed to delete user.");
                } else {
                    setSuccess(data.message || "User deleted successfully.");
                    fetchUsers();
                }
            })
            .catch((err) => {
                setError("An error occurred while deleting the user.");
            });
    };

    const handleBulkDelete = () => {
        if (!window.confirm("Delete selected users?")) return;

        fetch(`${process.env.REACT_APP_API_URL}/bulkDelete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ids: selectedUsers }),
        })
            .then((res) =>
                res.json().then((data) => ({ status: res?.status, data }))
            )
            .then(({ status, data }) => {
                if (status === 200) {
                    setSelectedUsers([]);
                    fetchUsers();
                    setSuccess("Users deleted successfully.");
                } else {
                    setError(data.message);
                }
            })
            .catch((err) => {
                setError("Bulk delete failed.");
            });
    };

    const handleBulkRole = () => {
        if (!selectedRole) {
            setError("Please select a role.");
            return;
        }
        if (!window.confirm("Change Roles of selected Users?")) return;

        fetch(`${process.env.REACT_APP_API_URL}/bulkRole`, {
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
                    setSelectedUsers([]);
                    fetchUsers();
                    setSuccess(
                        data?.message || "Users roles changed successfully."
                    );
                } else {
                    setError(data?.error || "Failed to change user roles.");
                }
            })
            .catch((err) => {
                setError("Bulk role assign failed. " + err.message);
            });
    };

    const handleClearFilter = () => {
        setSearch("");
        setPostFilter("");
        setSortField("id");
        setSortOrder("asc");
        setSelectedUsers([]);
        setPagination({ page: 1, per_page: 12, total: 0, last_page: 1 });
    };

    const handleVerifyUser = (userId) => {
        fetch(`${process.env.REACT_APP_API_URL}/masterVerify/${userId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to verify user.");
                }
                return res.json();
            })
            .then((data) => {
                setSuccess(data.message || "User verified successfully.");
                fetchUsers();
            })
            .catch((err) => {
                setError(err.message || "An error occurred while verifying user.");
            });
    };

    return (
        <div className="apple">
            <Header user={myProfile} />

            {/* View Toggle - Only visible to Master users */}
            {myProfile?.post === "Master" && (
                <div className="view-toggle-container">
                    <div className="view-toggle-wrapper">
                        <span className={`toggle-label ${!isUserView ? "active" : ""}`}>
                            Master View
                        </span>
                        <div className="toggle-switch">
                            <input
                                type="checkbox"
                                id="viewToggle"
                                checked={isUserView}
                                onChange={handleViewToggle}
                                className="toggle-input"
                            />
                            <label htmlFor="viewToggle" className="toggle-label-slider">
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                        <span className={`toggle-label ${isUserView ? "active" : ""}`}>
                            User View
                        </span>
                    </div>
                    <div className="current-view-indicator">
                        <span className="view-indicator">
                            Currently viewing as: <strong>{effectiveUserRole}</strong>
                        </span>
                    </div>
                </div>
            )}

            <div>
                <div className="filters-container">
                    {/* Search and filter */}
                    <input
                        placeholder="Search name/email"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                    <select
                        value={postFilter}
                        onChange={(e) => setPostFilter(e.target.value)}
                        className="select-input"
                    >
                        <option value="">All Posts</option>
                        <option value="Master">Master</option>
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                    </select>

                    {/* Sort dropdown */}
                    <select
                        value={`${sortField}-${sortOrder}`}
                        onChange={(e) => {
                            const [field, order] = e.target.value.split('-');
                            setSortField(field);
                            setSortOrder(order);
                        }}
                        className="select-input"
                    >
                        <option value="id-asc">ID (Ascending)</option>
                        <option value="id-desc">ID (Descending)</option>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="email-asc">Email (A-Z)</option>
                        <option value="email-desc">Email (Z-A)</option>
                        <option value="created_at-asc">Created (Oldest)</option>
                        <option value="created_at-desc">Created (Newest)</option>
                    </select>

                    {/* Main actions */}
                    <button
                        onClick={() => setModalUserAdd({})}
                        className="add-user-btn"
                        disabled={effectiveUserRole === "User"}
                    >
                        Add User
                    </button>

                    <button onClick={handleClearFilter} className="clear-filter-btn">
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
                        className="export-csv-btn"
                    >
                        Export CSV
                    </button>

                    {/* Bulk actions */}
                    {effectiveUserRole !== "User" && selectedUsers.length > 0 && (
                        <div className="btn-container" style={{marginLeft: "-18px"}}>
                            <button
                                onClick={handleBulkDelete}
                                className="bulk-delete-btn"
                                disabled={effectiveUserRole !== "Master"}
                            >
                                Delete Selected ({selectedUsers.length})
                            </button>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="select-input"
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
                                className="export-csv-btn"
                                disabled={!selectedRole || effectiveUserRole === "User"}
                            >
                                Change Role
                            </button>
                        </div>
                    )}
                </div>

                {/* Select All Checkbox */}
                {effectiveUserRole !== "User" && (
                    <div className="select-all-container">
                        <label className="select-all-label">
                            <input
                                type="checkbox"
                                checked={
                                    selectedUsers.length > 0 &&
                                    selectedUsers.length ===
                                        users.filter((u) => u.deleted_by === null).length
                                }
                                ref={(el) => {
                                    if (el) {
                                        el.indeterminate =
                                            selectedUsers.length > 0 &&
                                            selectedUsers.length <
                                                users.filter((u) => u.deleted_by === null).length;
                                    }
                                }}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                                className="select-all-checkbox"
                            />
                            Select All ({users.filter((u) => u.deleted_by === null).length} users)
                        </label>
                    </div>
                )}

                {/* User Cards Grid */}
                <div className="user-cards-grid">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className={`user-card ${
                                selectedUsers.includes(user.id) ? "selected" : ""
                            } ${user.deleted_by !== null ? "deactivated" : ""}`}
                        >
                            {/* Selection Checkbox */}
                            {effectiveUserRole !== "User" && (
                                <div className="card-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        disabled={user.deleted_by !== null}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            handleSelectUser(user.id);
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            )}

                
                                <div className="avatar-circle">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
    

                            {/* User Info */}
                            <div className="user-info">
                                <p className="user-email">{user.name}</p>
                                <p className="user-email">{user.email}</p>
                                <p className="user-id">ID: {user.id}</p>
                            </div>

                            {/* Role Badge */}
                            <div className="user-role">
                                <span className={`role-badge role-${user.post.toLowerCase()}`}>
                                    {user.post}
                                </span>
                            </div>

                            {/* Status Indicators */}
                            <div className="user-status-indicators">
                                <div className="status-row">
                                    <span className="status-label">Status:</span>
                                    <span
                                        className={
                                            user.deleted_by === null
                                                ? "status-active"
                                                : "status-deactivated"
                                        }
                                    >
                                        {user.deleted_by !== null ? "Deactivated" : "Active"}
                                    </span>
                                </div>
                                
                                <div className="status-row">
                                    <span className="status-label">Verified:</span>
                                    {user.email_verified_at ? (
                                        <span className="verified-badge">✔ Verified</span>
                                    ) : (
                                        <span className="unverified-badge">✘ Unverified</span>
                                    )}
                                </div>

                                <div className="status-row">
                                    <span className="status-label">Online:</span>
                                    <span className={user.last_logout === null ? "online" : "offline"}>
                                        {user.last_logout === null ? "● Online" : "● Offline"}
                                    </span>
                                </div>
                            </div>

                            {/* Created Date */}
                            <div className="user-created">
                                <span className="created-label">Created:</span>
                                <span className="created-date">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="card-actions">
                                {/* Verify Button */}
                                {!user.email_verified_at && effectiveUserRole === "Master" && (
                                    <button
                                        disabled={user.deleted_by !== null}
                                        className="card-btn verify-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleVerifyUser(user.id);
                                        }}
                                    >
                                        Verify
                                    </button>
                                )}

                                {/* Reactivate Button */}
                                {/* {user.deleted_by !== null && effectiveUserRole === "Master" && (
                                    <button
                                        className="card-btn reactivate-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleVerifyUser(user.id);
                                        }}
                                    >
                                        Reactivate
                                    </button>
                                )} */}

                                {/* Edit Button */}
                                {effectiveUserRole !== "User" && (
                                    <button
                                        className="card-btn edit-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setModalUser(user);
                                        }}
                                        disabled={
                                            user.deleted_by !== null ||
                                            effectiveUserRole === "User"
                                        }
                                    >
                                        {user.deleted_by !== null
                                            ? "N/A"
                                            : effectiveUserRole === "User"
                                            ? "No Access"
                                            : "Edit"}
                                    </button>
                                )}

                                {/* Delete Button */}
                                {effectiveUserRole !== "User" && (
                                    <button
                                        className="card-btn delete-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteUser(user.id);
                                        }}
                                        disabled={
                                            user.deleted_by !== null ||
                                            effectiveUserRole !== "Master" ||
                                            user.post === "Master" ||
                                            user.id === myProfile.id
                                        }
                                    >
                                        {user.id === myProfile.id
                                            ? "Self"
                                            : user.deleted_by !== null
                                            ? "N/A"
                                            : effectiveUserRole !== "Master"
                                            ? "No Access"
                                            : user.post === "Master"
                                            ? "Protected"
                                            : "Delete"}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {users.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">👥</div>
                        <h3>No users found</h3>
                        <p>Try adjusting your search or filter criteria.</p>
                    </div>
                )}

                {/* Pagination */}
                <div className="users-pagination">
                    <button
                        onClick={() => setPagination((p) => ({ ...p, page: 1 }))}
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
                        {[12, 24, 36, 48].map((n) => (
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
                                        Math.min(p.last_page, Number(e.target.value))
                                    ),
                                }))
                            }
                            style={{ width: 50 }}
                        />
                    </span>
                </div>

                {/* Modals */}
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
                    onClose={() => {setError(""); window.location.reload();}}
                />

                <SuccessModal
                    open={!!success}
                    message={success}
                    onClose={() => {setSuccess(""); window.location.reload();}}
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
)(UserCards);
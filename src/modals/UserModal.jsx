import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "../components/Dashboard.css";
import SuccessModal from "./SuccessModal";
import ErrorModal from "./ErrorModal";

const roleOptions = ["User", "Admin", "Master"];

function UserModal({ myProfile, user, onClose, onSave }) {
    const [form, setForm] = useState(user || {});
    const token = Cookies.get("jwt_token");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        setForm(user || {});
    }, [user]);

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
                    setError(data.error || "An error occurred while updating the user.");
                    return;
                }
                onSave(data);
                setSuccess("User details updated successfully!");
            })
            .catch((err) => {
                setError("Network error: " + err.message);
            });
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Edit User Details</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>ID:</label>
                        <input type="text" value={form.id} disabled />
                    </div>
                    <div>
                        <label>Name:</label>
                        <input
                            name="name"
                            value={form.name || ""}
                            onChange={handleChange}
                            disabled={myProfile?.post === "User"}
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            name="email"
                            value={form.email || ""}
                            onChange={handleChange}
                            disabled={myProfile?.post === "User"}
                        />
                    </div>
                    <div>
                        <label>Role:</label>
                        <select
                            name="post"
                            value={form.post || roleOptions[0]}
                            onChange={handleChange}
                            disabled={myProfile?.post === "User"}
                        >
                            {roleOptions.map((role) => (
                                <option key={role} value={role}>
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ marginTop: "1em", display: "flex", justifyContent: "flex-end" }}>
                        <button type="submit" hidden={myProfile?.post === "User"}>
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ marginLeft: "1em" }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>

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
    );
}

export default UserModal;
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "../components/Dashboard.css";
import ErrorModal from "./ErrorModal";
import SuccessModal from "./SuccessModal";


//Modal for adding a new user
// This modal allows admins to add new users with validation for email and name

const roleOptions = ["User", "Admin", "Master"];

function UserModalAdd({ user, onClose, onSave }) {
    const [form, setForm] = useState({ name: "", email: "", post: "User" });
    const [emailError, setEmailError] = useState("");
    const [nameError, setNameError] = useState("");
    const token = Cookies.get("jwt_token");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (user && typeof user === "object") {
            setForm({
                name: user.name || "",
                email: user.email || "",
                post: user.post || "User" 
            });
        } else {
            setForm({ 
                name: "", 
                email: "", 
                post: "User" 
            });
        }
    }, [user]);

    if (!user) return null;

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "email") {
            if (!value) setEmailError("Email is required");
            else if (!validateEmail(value)) setEmailError("Invalid email address");
            else setEmailError("");
        }
        if (name === "name") {
            if (!value) setNameError("Name is required");
            else setNameError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name) setNameError("Name is required");
        if (!form.email) setEmailError("Email is required");
        if (!form.name || !form.email || emailError || nameError) return;

        try {
            // First check if email exists
            const checkRes = await fetch(
            `${process.env.REACT_APP_API_URL}/checkEmail?email=${encodeURIComponent(form.email)}`,
            {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
            }
            );
            const checkData = await checkRes.json();
            if (checkData.exists) {
            setError("Email already in use");
            return;
            }

            // If not exists, proceed to add user
            const res = await fetch(`${process.env.REACT_APP_API_URL}/addUser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to add user. Please try again.");
                return;
            }

            setSuccess(data.message || "User added successfully.");
            onSave(data);
        } catch (err) {
            setError(err || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Add User</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name: </label>
                        <input
                            name="name"
                            value={form.name || ""}
                            onChange={handleChange}
                            required
                        />
                        {nameError && (
                            <div style={{ color: "red", fontSize: "0.9em" }}>
                                {nameError}
                            </div>
                        )}
                    </div>
                    <div>
                        <label>Email: </label>
                        <input
                            name="email"
                            value={form.email || ""}
                            onChange={handleChange}
                            required
                        />
                        {emailError && (
                            <div style={{ color: "red", fontSize: "0.9em" }}>
                                {emailError}
                            </div>
                        )}
                    </div>
                    <div>
                        <label>Role: </label>
                        <select
                            name="post"
                            value={form.post || roleOptions[0]}
                            onChange={handleChange}
                        >
                            {roleOptions.map((role) => (
                                <option key={role} value={role}>
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ marginTop: "1em" }}>
                        <button
                            type="submit"
                            disabled={
                                !!emailError ||
                                !!nameError ||
                                !form.email ||
                                !form.name
                            }
                        >
                            Add User
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ marginLeft: "10px" }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>


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

export default UserModalAdd;
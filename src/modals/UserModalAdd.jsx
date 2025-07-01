import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "../components/Dashboard.css"; // Assuming you have a CSS file for styles


//Modal for adding a new user
// This modal allows admins to add new users with validation for email and name

const roleOptions = ["User", "Admin", "Master"];

function UserModalAdd({ user, onClose, onSave }) {
    const [form, setForm] = useState({ name: "", email: "", post: "User" });
    const [emailError, setEmailError] = useState("");
    const [nameError, setNameError] = useState("");
    const token = Cookies.get("jwt_token");

    useEffect(() => {
        setForm(user && typeof user === "object" ? user : { name: "", email: "", post: "User" });
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
            `http://localhost:8000/checkEmail?email=${encodeURIComponent(form.email)}`,
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
            alert("Email already in use");
            return;
            }

            // If not exists, proceed to add user
            const res = await fetch(`http://localhost:8000/addUser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            onSave(data);
        } catch (err) {
            alert("An error occurred. Please try again.");
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
            </div>
        </div>
    );
}

export default UserModalAdd;
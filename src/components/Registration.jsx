import React, { useState } from "react";
import "./register.css";
import { Link } from "react-router-dom";

const roles = ["User", "Master", "Admin"];

const initialState = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",
    terms: false,
};

export default function RegistrationForm({ onSubmit }) {
    const [form, setForm] = useState(initialState);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    // Helper for validating a single field
    const validateField = (field, value, formState = form) => {
        let err = "";
        if (field === "name") {
            if (!value) err = "Name is required";
        }
        if (field === "email") {
            if (!value) err = "Email is required";
            else if (!/^\S+@\S+\.\S+$/.test(value)) err = "Email is invalid";
        }
        if (field === "password") {
            if (!value) err = "Password is required";
            else if (value.length < 9)
                err = "Password must be at least 9 characters";
        }
        if (field === "confirmPassword") {
            if (!value) err = "Please confirm your password";
            else if (value !== formState.password)
                err = "Passwords do not match";
        }
        if (field === "role") {
            if (!value) err = "Role is required";
        }
        if (field === "terms") {
            if (!value) err = "You must accept the terms";
        }
        return err;
    };

    // Handle input changes and validation
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === "checkbox" ? checked : value;
        const updatedForm = { ...form, [name]: fieldValue };
        setForm(updatedForm);

        // Validate the field and update errors accordingly
        const errorMsg = validateField(name, fieldValue, updatedForm);
        setErrors((prev) => {
            // Remove error if fixed, otherwise update error
            const newErrors = { ...prev };
            if (!errorMsg) {
                delete newErrors[name];
            } else {
                newErrors[name] = errorMsg;
            }
            // Special case: clear confirm password error if password changes and now matches
            if (name === "password" && updatedForm.confirmPassword) {
                const confirmError = validateField(
                    "confirmPassword",
                    updatedForm.confirmPassword,
                    updatedForm
                );
                if (!confirmError) {
                    delete newErrors.confirmPassword;
                } else {
                    newErrors.confirmPassword = confirmError;
                }
            }
            return newErrors;
        });
    };

    // Validate all fields before submit
    const validateAll = () => {
        let currErrors = {};
        Object.keys(form).forEach((key) => {
            const errorMsg = validateField(key, form[key], form);
            if (errorMsg) currErrors[key] = errorMsg;
        });
        setErrors(currErrors);
        return Object.keys(currErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateAll()) {
            onSubmit && onSubmit(form);
            //alert("Registration successful! (You can connect this to your backend)");
            setForm(initialState);
            setErrors({});
        }
    };

    const isFormValid = () => {
        return (
            form.name &&
            form.email &&
            /^\S+@\S+\.\S+$/.test(form.email) &&
            form.password.length > 8 &&
            form.password === form.confirmPassword &&
            form.role &&
            form.terms
        );
    };

    return (
        <form
            className="registration-form"
            onSubmit={handleSubmit}
            autoComplete="off"
        >
            <h2>Create an Account</h2>
            <div className="form-group">
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange} />
                {errors.name && <span className="error">{errors.name}</span>}
            </div>
            <div className="form-group">
                <label>Email</label>
                <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                />
                {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="form-group password-group">
                <label>Password</label>
                <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                />
                <button
                    type="button"
                    className="show-hide-btn"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                >
                    {showPassword ? "Hide" : "Show"}
                </button>
                {errors.password && (
                    <span className="error">{errors.password}</span>
                )}
            </div>
            <div className="form-group">
                <label>Confirm Password</label>
                <input
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                />
                {errors.confirmPassword && (
                    <span className="error">{errors.confirmPassword}</span>
                )}
            </div>
            {/* <div className="form-group">
        <label>Role</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="">Select role</option>
          {roles.map((role) => (
            <option key={role}>{role}</option>
          ))}
        </select>
        {errors.role && <span className="error">{errors.role}</span>}
      </div> */}
            <div className="form-group terms">
                <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={form.terms}
                    onChange={handleChange}
                />
                <label htmlFor="terms">
                    I accept the <Link to="/terms">terms &amp; conditions</Link>
                </label>
                {errors.terms && <span className="error">{errors.terms}</span>}
            </div>
            <button
                type="submit"
                disabled={!isFormValid()}
                className="submit-btn"
            >
                Register
            </button>
            <div className="login-link">
                Already have an account? <Link to="/login">Login Here</Link>
            </div>
        </form>
    );
}

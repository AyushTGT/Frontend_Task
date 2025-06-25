import React, { useState } from "react";
import "./register.css";
import { Link } from "react-router-dom";
import Header from "./Header";

const initialState = {
    password: "",
    confirmPassword: "",
};

//Reset Passwprd form

export default function ResetForm({ onSubmit }) {
    const [form, setForm] = useState(initialState);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    // Helper for validating a single field
    const validateField = (field, value, formState = form) => {
        let err = "";
        if (field === "password") {
            if (!value) err = "Password is required";
            else if (value.length < 6)
                err = "Password must be at least 6 characters";
        }
        if (field === "confirmPassword") {
            if (!value) err = "Please confirm your password";
            else if (value !== formState.password)
                err = "Passwords do not match";
        }
        return err;
    };

    // Handle input changes and validation
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === "checkbox" ? checked : value;
        const updatedForm = { ...form, [name]: fieldValue };
        setForm(updatedForm);

        const errorMsg = validateField(name, fieldValue, updatedForm);
        setErrors((prev) => {
            const newErrors = { ...prev };
            if (!errorMsg) {
                delete newErrors[name];
            } else {
                newErrors[name] = errorMsg;
            }
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
            setForm(initialState);
            setErrors({});
        }
    };

    const isFormValid = () => {
        return (
            form.password.length > 8 && form.password === form.confirmPassword
        );
    };

    return (
        <form
            className="registration-form"
            onSubmit={handleSubmit}
            autoComplete="off"
        >
            <h2>Reset Password</h2>

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
            <button
                type="submit"
                disabled={!isFormValid()}
                className="submit-btn"
            >
                Change Password
            </button>
        </form>
    );
}

import React, { useState } from "react";
import "./register.css";
import { Link } from "react-router-dom";

const initialState = {
  email: "",
};

export default function ResetEmailForm({ onSubmit }) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});

  // Helper for validating a single field
  const validateField = (field, value, formState = form) => {
    let err = "";
    if (field === "email") {
      if (!value) err = "Email is required";
      else if (!/^\S+@\S+\.\S+$/.test(value)) err = "Email is invalid";
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
      form.email &&
      /^\S+@\S+\.\S+$/.test(form.email)
    );
  };

  return (
    <form
      className="registration-form"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <h2>Confirm Email</h2>
      <div className="form-group">
        <label>Email</label>
        <input name="email" value={form.email} onChange={handleChange} />
        {errors.name && <span className="error">{errors.email}</span>}
      </div>
      <button type="submit" disabled={!isFormValid()} className="submit-btn">
        Send Reset Link
      </button>
      <div className="login-link">
        <Link to="/login">Login Here</Link>
      </div>
    </form>
  );
}

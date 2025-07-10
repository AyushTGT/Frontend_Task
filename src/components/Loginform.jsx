import React, { useState, useMemo } from "react";
import "./register.css";
import { useSelector, useDispatch } from "react-redux";
import {
    updateLoginForm,
    resetLoginForm,
    setLoginErrors,
    setLoginLoading,
} from "../redux/action";
import ReCAPTCHA from "react-google-recaptcha";

export default function Loginform({ onSubmit }) {
    const form = useSelector((state) => state.login.form);
    const errors = useSelector((state) => state.login.errors);
    const isLoading = useSelector((state) => state.login.isLoading);
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState("");

    const validateField = (field, value) => {
        let err = "";
        if (field === "email") {
            if (!value) err = "Email is required";
            else if (!/^\S+@\S+\.\S+$/.test(value)) err = "Email is invalid";
        }
        if (field === "password") {
            if (!value) err = "Password is required";
        }
        return err;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === "checkbox" ? checked : value;
        dispatch(updateLoginForm(name, fieldValue));

        const errorMsg = validateField(name, fieldValue);
        dispatch(
            setLoginErrors({
                ...errors,
                [name]: errorMsg || undefined,
            })
        );
    };

    const validateAll = () => {
        let currErrors = {};
        Object.keys(form).forEach((key) => {
            // Skip validation for rememberMe checkbox
            if (key === "rememberMe" || key === "recaptchaToken") return;
            const errorMsg = validateField(key, form[key]);
            if (errorMsg) currErrors[key] = errorMsg;
        });
        dispatch(setLoginErrors(currErrors));
        return Object.keys(currErrors).length === 0;
    };

    const handleRecaptchaChange = (token) => {
        dispatch(updateLoginForm("recaptchaToken", token));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.recaptchaToken) {
            alert("Please complete the CAPTCHA.");
            return;
        }

        if (validateAll()) {
            dispatch(setLoginLoading(true));
            try {
                await onSubmit(form);
                dispatch(resetLoginForm());
            } catch (err) {
                alert("Login failed: " + err.message);
            } finally {
                dispatch(setLoginLoading(false));
            }
        }
    };

    const isFormValid = useMemo(() => {
        return (
            form.email &&
            /^\S+@\S+\.\S+$/.test(form.email) &&
            form.password.length > 0
        );
    }, [form.email, form.password]);

    return (
        <form
            className="registration-form"
            onSubmit={handleSubmit}
            autoComplete="off"
        >
            <h2>Login to your Account</h2>
            <div className="form-group">
                <label>Email</label>
                <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    disabled={isLoading}
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
                    disabled={isLoading}
                />
                <button
                    type="button"
                    className="show-hide-btn"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    disabled={isLoading}
                >
                    {showPassword ? "Hide" : "Show"}
                </button>
                {errors.password && (
                    <span className="error">{errors.password}</span>
                )}
            </div>

            {/* Add Remember Me checkbox */}
            <div className="form-group checkbox-group">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        name="rememberMe"
                        checked={form.rememberMe}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                    <span className="checkmark"></span>
                    Remember Me
                </label>
            </div>

            <ReCAPTCHA
                sitekey="6LcDu3IrAAAAAA31RbkV4pHZtZHzdfi8Wujydxs3"
                onChange={handleRecaptchaChange}
            />

            <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="submit-btn"
            >
                {isLoading ? "Logging in..." : "Login"}
            </button>
            {isLoading && <div className="spinner"></div>}

            <div className="login-link">
                <a href="/forget">Forgot Password? </a>
            </div>
            <div className="login-link">
                Don't have an Account? <a href="/">Register Here</a>
            </div>
        </form>
    );
}
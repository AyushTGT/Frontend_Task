import React from "react";
import RegistrationForm from "./Registration";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { useState } from "react";
import "./Dashboard.css";
import ErrorModal from "../modals/ErrorModal";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFormSubmit = async (formData) => {
        setIsLoading(true);
        const { name, email, password, role } = formData;

        try {
            const response = await fetch(
                `http://localhost:8000/checkEmail?email=${encodeURIComponent(
                    email
                )}`
            );
            if (!response.ok) {
                setError("Error checking email availability");
                setIsLoading(false);
                return;
            }
            const emailExists = await response.json();

            if (emailExists.exists && emailExists.verified === true) {
                setError("Already registered with this email. Please login.");
                navigate("/login");
                setIsLoading(false);
                return;
            } else if (emailExists.exists && emailExists.verified === false) {
                setError(
                    "Email is not verified. Please verify your email first and login."
                );
                navigate("/login");
                setIsLoading(false);
                return;
            }

            const data = new FormData();
            data.append("name", name);
            data.append("email", email);
            data.append("password", password);
            data.append("post", role);

            const regResponse = await fetch(
                "http://localhost:8000/RegisteringUser",
                {
                    method: "POST",
                    body: data,
                }
            );
            if (!regResponse.ok) {
                setIsLoading(false);
                throw new Error("Registration failed");
            }
            const result = await regResponse.json();
            setError(
                "Registration successful!\n" + JSON.stringify(result.message)
            );
            navigate("/login");
        } catch (error) {
            setError(
                "Error during registration: " + JSON.stringify(error.message)
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "40px",
                background: "linear-gradient(120deg, #e0eafc, #cfdef3)",
            }}
        >
            <Header />
            <div
                style={{
                    minHeight: "100vh",
                    background: "linear-gradient(120deg, #e0eafc, #cfdef3)",
                }}
            >
                <RegistrationForm onSubmit={handleFormSubmit} />

                {isLoading && (
                    <div className="spinner" style={{ marginTop: "20px" }}></div>
                )}

                <ErrorModal
                    open={!!error}
                    message={error}
                    onClose={() => setError("")}
                />
            </div>
        </div>
    );
}

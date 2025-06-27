import React from "react";
import Loginform from "./Loginform";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "./Header";
import { useState } from "react";
import ErrorModal from "../modals/ErrorModal";

//Handling login logic with fomr in loginform.jsx page

export default function LoginPage() {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleFormSubmit = async (formData) => {
        const { email, password } = formData;

        try {
            const response = await fetch(
                `http://localhost:8000/checkEmail?email=${encodeURIComponent(
                    email
                )}`
            );
            if (!response.ok) {
                setError("Error checking email availability");
                return;
            }
            const emailExists = await response.json();

            if (emailExists.deleted !== null) {
                if (emailExists.deleted !== email) {
                    setError("Email is deleted.");
                    navigate("/login");
                    return;
                } else {
                    const reRegisterData = new FormData();
                    reRegisterData.append("email", email);

                    const reRegisterResponse = await fetch(
                        "http://localhost:8000/reRegisteringUser",
                        {
                            method: "POST",
                            body: reRegisterData,
                        }
                    );
                    if (!reRegisterResponse.ok) {
                        setError("Error re-registering user");
                        return;
                    }
                    setError(
                        "Re-registration email sent. Please check your inbox to verify your account."
                    );
                    navigate("/login");
                    return;
                }
            }

            if (emailExists.exists && emailExists.verified === false) {
                setError(
                    "Email is not verified. Please verify your email first and login."
                );
                navigate("/login");
                return;
            }

            // Proceed with login
            const data = new FormData();
            data.append("email", email);
            data.append("password", password);

            const regResponse = await fetch("http://localhost:8000/login", {
                method: "POST",
                body: data,
            });

            const result = await regResponse.json();

            if (!regResponse.ok) {
                const backendError = result.error || "Login failed";
                setError("Error during login: " + backendError);
                return;
            }

            Cookies.set("jwt_token", result.token, { expires: 7 });

            navigate("/Home");
        } catch (error) {
            setError("Error during login: " + JSON.stringify(error.message));
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
                <Loginform onSubmit={handleFormSubmit} />

                <ErrorModal
                    open={!!error}
                    message={error}
                    onClose={() => setError("")}
                />
            </div>
        </div>
    );
}

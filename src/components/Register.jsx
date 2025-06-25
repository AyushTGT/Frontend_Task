import React from "react";
import RegistrationForm from "./Registration";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

export default function RegisterPage() {
    const navigate = useNavigate();

    const handleFormSubmit = async (formData) => {
        const { name, email, password, role } = formData;

        try {
            const response = await fetch(
                `http://localhost:8000/checkEmail?email=${encodeURIComponent(
                    email
                )}`
            );
            if (!response.ok) {
                alert("Error checking email availability");
                return;
            }
            const emailExists = await response.json();

            if (emailExists.exists && emailExists.verified === true) {
                alert("Already registered with this email. Please login.");
                navigate("/login");
                return;
            } else if (emailExists.exists && emailExists.verified === false) {
                alert(
                    "Email is not verified. Please verify your email first and login."
                );
                navigate("/login");
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
                throw new Error("Registration failed");
            }
            const result = await regResponse.json();
            alert(
                "Registration successful!\n" + JSON.stringify(result.message)
            );
            navigate("/login");
        } catch (error) {
            alert(
                "Error during registration: " + JSON.stringify(error.message)
            );
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
            </div>
        </div>
    );
}

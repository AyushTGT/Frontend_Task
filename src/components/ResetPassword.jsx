import React from "react";
import { useNavigate } from "react-router-dom";
import ResetForm from "./ResetPassForm";
import { useLocation } from "react-router-dom";
import Header from "./Header";


export default function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const email = params.get("email");

    const handleFormSubmit = async (formData) => {
        const { password } = formData;

        try {
            const data = new FormData();
            data.append("password", password);
            data.append("email", email);

            const regResponse = await fetch(
                "http://localhost:8000/resetPassword",
                {
                    method: "POST",
                    body: data,
                }
            );
            if (!regResponse.ok) {
                throw new Error("Password Reset failed");
            }
            const result = await regResponse.json();
            alert(
                "Passroed Reset successful!\n" + JSON.stringify(result.message)
            );
            navigate("/login");
        } catch (error) {
            alert(
                "Error during Password Reset: " + JSON.stringify(error.message)
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
                <ResetForm onSubmit={handleFormSubmit} />
            </div>
        </div>
    );
}

import React from "react";
import { useNavigate } from "react-router-dom";
import ResetEmailForm from "./ResetEmail";
import Header from "./Header";

// Allow user to change the password with for in the reserEmail page

export default function ResetPage() {
    const navigate = useNavigate();

    const handleFormSubmit = async (formData) => {
        const { email } = formData;

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

            if (!emailExists.exists) {
                alert("No account found with this email. Please register.");
                navigate("/");
                return;
            } else if (emailExists.exists && emailExists.verified === false) {
                alert(
                    "Email is not verified. Please verify your email first and login."
                );
                navigate("/login");
                return;
            }

            // Proceed with registration if email is not present
            const data = new FormData();
            data.append("email", email);

            const regResponse = await fetch(
                "http://localhost:8000/forgetPassword",
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
                "Password Reset Link Sent!\n" + JSON.stringify(result.message)
            );
            navigate("/login");
        } catch (error) {
            alert("Couldn't Reset Password: " + JSON.stringify(error.message));
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
                <ResetEmailForm onSubmit={handleFormSubmit} />
            </div>
        </div>
    );
}

import RegistrationForm from "./Registration";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "./Header";
import "./Dashboard.css";
import ErrorModal from "../modals/ErrorModal";
import SuccessModal from "../modals/SuccessModal";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleFormSubmit = async (formData) => {
        setIsLoading(true);
        const { name, email, password, role } = formData;

        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/checkEmail?email=${encodeURIComponent(
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
                setTimeout(() => {
                    navigate("/login");
                }, 5000);
                setIsLoading(false);
                return;
            } else if (emailExists.exists && emailExists.verified === false) {
                setError(
                    "Email is not verified. Please verify your email first and login."
                );
                setTimeout(() => {
                    navigate("/login");
                }, 5000);
                setIsLoading(false);
                return;
            }

            const data = new FormData();
            data.append("name", name);
            data.append("email", email);
            data.append("password", password);
            data.append("post", role);

            const regResponse = await fetch(
                `${process.env.REACT_APP_API_URL}/RegisteringUser`,
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
            setSuccess("Registration successful! Please check your email for verification.");
            setTimeout(() => {
                    navigate("/login");
                }, 5000);
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
            className="contain"
        >
            <Header />
            <div
                style={{minHeight: "100vh"}}
            >
                <RegistrationForm onSubmit={handleFormSubmit} />

                {isLoading && (
                    <div className="spinner" style={{ marginTop: "20px" }}></div>
                )}

                <ErrorModal
                    open={!!error}
                    message={error}
                    onClose={() => {setError(""); window.location.reload();}}
                />

                <SuccessModal
                    open={!!success}
                    message={success}
                    onClose={() => {setSuccess(""); window.location.reload();}}
                    title="Successful"
                />
            </div>
        </div>
    );
}

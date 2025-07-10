import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import Header from "./Header";
import ErrorModal from "../modals/ErrorModal";
import Loginform from "./Loginform";
import "./Dashboard.css";

//Handling login logic with form in loginform.jsx page

export default function LoginPage() {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleFormSubmit = async (formData) => {
        const { email, password, recaptchaToken, rememberMe } = formData;

        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/checkEmail?email=${encodeURIComponent(
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
                    setTimeout(() => {
                       navigate("/login");
                    }, 5000);
                    return;
                } else {
                    const reRegisterData = new FormData();
                    reRegisterData.append("email", email);
                    
                    const reRegisterResponse = await fetch(
                        `${process.env.REACT_APP_API_URL}/reRegisteringUser`,
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
                    setTimeout(() => {
                    navigate("/login");
                }, 5000);
                    return;
                }
            }

            if (emailExists.exists && emailExists.verified === false) {
                setError(
                    "Email is not verified. Please verify your email first and login."
                );
                setTimeout(() => {
                    navigate("/login");
                }, 5000);
                return;
            }

            // Proceed with login
            const data = new FormData();
            data.append("email", email);
            data.append("password", password);
            data.append("recaptchaToken", recaptchaToken);
            data.append("rememberMe", rememberMe ? "1" : "0");

            const regResponse = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
                method: "POST",
                body: data,
            });

            const result = await regResponse.json();

            if (!regResponse.ok) {
                const backendError = result.error || "Login failed";
                setError("Error during login: " + backendError);
                return;
            }

            // Set cookie expiration based on rememberMe
            const cookieOptions = {
                expires: rememberMe ? 30 : 7 // 30 days if remember me, otherwise 7 days
            };
            
            Cookies.set("jwt_token", result.token, cookieOptions);

            navigate("/Home");
        } catch (error) {
            setError("Error during login: " + JSON.stringify(error.message));
        }
    };

    return (
        <div
            className="contain"           
        >
            <Header />
            <div
                style={{ minHeight: "100vh"}}
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
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
                `${process.env.REACT_APP_API_URL}/checkEmail?email=${encodeURIComponent(
                    email
                )}`
            );
            if (!response.ok) {
                alert("Error checking email availability");
                return;
            }
            const emailExists = await response.json();

            if (!emailExists?.exists) {
                alert("No account found with this email. Please register.");
                navigate("/");
                return;
            } else if (emailExists?.exists && emailExists.verified === false) {
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
                `${process.env.REACT_APP_API_URL}/forgetPassword`,
                {
                    method: "POST",
                    body: data,
                }
            );
            if (!regResponse.ok) {
                throw new Error("Reset of Password failed");
            }
            const result = await regResponse.json();
            alert(
                "Password Reset Link Sent!\n"
            );
            navigate("/login");
        } catch (error) {
            alert("Couldn't Reset Password: " + (error.message || "Unknown error"));
        }
    };

    return (
        <div>
            <Header />
            <div>
                <ResetEmailForm onSubmit={handleFormSubmit} />
            </div>
        </div>
    );
}

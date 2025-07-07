import { useNavigate } from "react-router-dom";
import ResetForm from "./ResetPassForm";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import "./Dashboard.css";


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
                `${process.env.REACT_APP_API_URL}/resetPassword`,
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
                "Password Reset successful!\n"
            );
            navigate("/login");
        } catch (error) {
            alert(
                "Error during Password Reset: " + (error.message || "Unknown error")
            );
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
                <ResetForm onSubmit={handleFormSubmit} />
            </div>
        </div>
    );
}

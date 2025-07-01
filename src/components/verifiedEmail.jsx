import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyEmail() {
    const [message, setMessage] = useState("Verifying...");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        if (!token) {
            setMessage("Missing verification token.");
            return;
        }
        console.log("Verification token:");
        fetch(`http://localhost:8000/emailVerification?token=${token}`, {
            method: "GET",
        })
            .then(async (response) => {
                console.log("Response status:", response.status);
                const data = await response.json();
                setMessage(data.message);

                setTimeout(() => {
                  navigate('/login');
                }, 3000);
            })
            .catch(() => {
                console.log("Verification failed");
                setMessage("Verification failed. Please try again.");
            });
    }, []);
    console.log("Verification effect triggered");
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>{message}</h2>
            <p>You will be redirected to the login page shortly...</p>
        </div>
    );
}

export default VerifyEmail;

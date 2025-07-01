import React from "react";
import Header from "./Header"; 

const TermsAndConditions = () => (
    <div
        style={{
            display: "flex",
            flexDirection: "column",
            gap: "40px",
            background: "linear-gradient(120deg, #e0eafc, #cfdef3)",
        }}
    >
        <Header />
        <div className="terms-container">
            <h1>Terms and Conditions</h1>
            <p>
                Welcome to our application. Please read these terms and
                conditions carefully.
            </p>
            <h2>1. Acceptance of Terms</h2>
            <p>By using our service, you agree to be bound by these terms.</p>

            <h2>2. Contact Us</h2>
            <p>
                If you have any questions about these terms, please contact us
                at ayush.tomar@vmock.com.
            </p>
        </div>
    </div>
);

export default TermsAndConditions;

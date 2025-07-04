import Header from "./Header"; 
import "./Dashboard.css";

const TermsAndConditions = () => (
    <div
        className="contain"
    >
        <Header />
        <div
            className="terms"
            
        >
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
                at{" "}
                <a
                    href="mailto:ayush.tomar@vmock.com"
                    className="terms-email-link"
                >
                    ayush.tomar@vmock.com
                </a>
                .
            </p>
        </div>
    </div>
);

export default TermsAndConditions;

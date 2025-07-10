import { useEffect, useState } from "react";
import "./Dashboard.css";
import Header from "./HeaderDashboard.jsx";
import ErrorModal from "../modals/ErrorModal.jsx";
import SuccessModal from "../modals/SuccessModal.jsx";
import { userDetails } from "../apis/taskapis";
import Cookies from "js-cookie";
import axios from "axios";

export default function Messaging() {
    const [myProfile, setMyProfile] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [userError, setUserError] = useState("");

    const token = Cookies.get("jwt_token");
    const maxMessageLength = 500;

    // Fetch all users for dropdown
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/userName`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setUsers(res.data);
            })
            .catch(() => {});
    }, [token]);

    // Send message
    const handleSendMessage = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);
        try {
            await fetch("http://localhost:8000/sendMessage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    assignee: selectedUserId,
                    message: message.trim(),
                }),
            }).then(async (res) => {
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.message || "Failed to send message.");
                }
            });

            setSuccess("Message sent successfully!");
            setMessage("");
            setSelectedUserId("");
        } catch (error) {
            setError(error.message || "Failed to send message.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Clear form
    const handleClear = () => {
        setSelectedUserId("");
        setMessage("");
        setError("");
    };

    useEffect(() => {
        async function fetchUserDetails() {
            try {
                const userData = await userDetails();
                setMyProfile(userData);
            } catch (err) {
                setUserError(err.message);
            }
        }
        fetchUserDetails();
    }, []);

    const selectedUser = users.find(
        (user) => user.id === parseInt(selectedUserId)
    );
    const remainingChars = maxMessageLength - message.length;

    return (
        <>
            <style>{messagingStyles}</style>
            <div className="apple">
                <Header user={myProfile} />

                <div className="messaging-container">
                    <div className="messaging-header">
                        <h1 className="messaging-title">Send Message</h1>
                    </div>

                    <form
                        onSubmit={handleSendMessage}
                        className="messaging-form"
                    >
                        <div className="form-group">
                            <label
                                htmlFor="recipient"
                                className="form-label required"
                            >
                                Send to
                            </label>
                            <select
                                id="recipient"
                                value={selectedUserId}
                                onChange={(e) =>
                                    setSelectedUserId(e.target.value)
                                }
                                className="user-select"
                                disabled={isLoading || users.length === 0}
                                required
                            >
                                <option value="">
                                    {isLoading
                                        ? "Loading users..."
                                        : "Select a user"}
                                </option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label
                                htmlFor="message"
                                className="form-label required"
                            >
                                Message
                            </label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="message-input"
                                placeholder="Enter your message here..."
                                maxLength={maxMessageLength}
                                required
                            />
                            <div
                                className={`char-count ${
                                    remainingChars < 50
                                        ? remainingChars < 0
                                            ? "error"
                                            : "warning"
                                        : ""
                                }`}
                            >
                                {remainingChars} characters remaining
                            </div>
                            <div className="form-help">
                                This will be sent as a notification to the
                                selected user
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={handleClear}
                                className="btn btn-secondary"
                                disabled={isSubmitting}
                            >
                                Clear
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={
                                    isSubmitting ||
                                    !selectedUserId ||
                                    !message.trim()
                                }
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        Sending...
                                    </>
                                ) : (
                                    "Send Message"
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <ErrorModal
                    open={!!error}
                    message={error}
                    onClose={() => {setError(""); window.location.reload();}}
                />

                <SuccessModal
                    open={!!success}
                    message={success}
                    onClose={() => {setSuccess(""); window.location.reload();}}
                />
            </div>
        </>
    );
}

const messagingStyles = `
.messaging-container {
    max-width: 800px;
    min-height: 68vh;
    margin: 24px auto;
    padding: 24px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.messaging-title {
    text-align: center;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.messaging-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-label {
    font-weight: 600;
    color: #374151;
}

.form-label.required::after {
    content: " *";
    color: #ef4444;
}

.user-select, .message-input {
    padding: 12px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s;
}

.user-select:focus, .message-input:focus {
    outline: none;
    border-color: #667eea;
}

.message-input {
    min-height: 120px;
    resize: vertical;
    font-family: inherit;
}

.char-count {
    text-align: right;
    font-size: 0.875rem;
    color: #6b7280;
}

.char-count.warning { color: #f59e0b; }
.char-count.error { color: #ef4444; }

.form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 16px;
}

.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
}

.loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.current-info {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
    font-size: 0.875rem;
    color: #475569;
}
`;

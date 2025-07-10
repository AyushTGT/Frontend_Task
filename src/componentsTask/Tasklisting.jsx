import Header from "./Header";
import React, { useEffect, useState } from "react";
import { userDetails } from "../apis/taskapis";
import { TasksListPage } from "./Kanban/KanbanListing";
import axios from "axios";
import AddTaskModal from "../modals/AddTaskModal";
import Cookies from "js-cookie";
import SuccessModal from "../modals/SuccessModal";
import ErrorModal from "../modals/ErrorModal";

//Taks listing component from kanban listing page

const addStyle = {
    width: "100%",
    minHeight: "70px",
    background: "#fff",
    borderRadius: "32px",
    display: "flex",
    justifyContent: "center",
    marginBottom: "32px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    cursor: "pointer",
    fontSize: "48px",
    color: "#888",
    transition: "box-shadow 0.2s",
    border: "2px dashed #ddd",
};

export default function Tasklisting() {
    const [user, setUser] = useState(null);
    const [userError, setUserError] = useState(null);
    const [addTaskOpen, setAddTaskOpen] = useState(false);
    const [reporterOptions, setReporterOptions] = useState([]);
    const [success, setSuccess] = useState(null);
    const token = Cookies.get("jwt_token");

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/userName`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setReporterOptions(res.data);
            })
            .catch(() => {});
    }, [token]);

    useEffect(() => {
        async function fetchUser() {
            try {
                const data = await userDetails();
                if (data) setUser(data);
            } catch (err) {
                setUserError(err.message);
            }
        }
        fetchUser();
    }, []);

    return (
        <div style={{ flex: 1, background: "#f5f6fa", padding: "24px" }}>
            <Header user={user} />
            <div
                style={ addStyle }
                onClick={() => setAddTaskOpen(true)}
                title="Add Task"
            >
                <span
                    style={{fontSize: "64px", fontWeight: "bold", lineHeight: 1}}
                >
                    +
                </span>
            </div>
            <div>
                <TasksListPage user={user} />
                <AddTaskModal
                    open={addTaskOpen}
                    onClose={() => {
                        setAddTaskOpen(false);
                        window.location.reload();
                    }}
                    userOptions={reporterOptions}
                    loggedInUser={user}
                    onSave={async (form) => {
                        try {
                            await axios.post(
                                `${process.env.REACT_APP_API_URL}/addTask`,
                                form,
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            );
                            setAddTaskOpen(false);
                            window.location.reload();
                            setSuccess("Task Added Successfully");
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        } catch (err) {
                            setAddTaskOpen(false);
                            setUserError(
                                "Error adding task: " +
                                    (err.response?.data?.message || err.message)
                            );
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        }
                    }}
                />

                <SuccessModal
                    open={!!success}
                    message={success}
                    onClose={() => {setSuccess(""); window.location.reload();}}
                    title="Successful"
                />

                <ErrorModal
                    open={!!userError}
                    message={userError}
                    onClose={() => {setUserError(""); window.location.reload();}}
                />
            </div>
        </div>
    );
}

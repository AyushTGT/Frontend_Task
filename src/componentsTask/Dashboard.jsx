import React, { useState, useEffect, useRef } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
} from "chart.js";
import MetricCards from "./MetricCards";
import Header from "./Header";
import {
    fetchTaskCount,
    userDetails,
    overDue,
    thisMonth,
} from "../apis/taskapis";
import NotificationBell from "./Notification";
import axios from "axios";
import "./MetricCard.css";
import Select from "react-select";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
);

// Dashboardtask component to display task metrics and charts

export default function Dashboardtask() {
    const [metrics, setMetrics] = useState([
        { label: "Tasks Completed", value: 0 },
        { label: "Pending Tasks", value: 0 },
        { label: "Total Tasks", value: 0 },
        { label: "Overdue Tasks", value: 0 },
        { label: "Tasks Completed This Month", value: 0 },
        { label: "Tasks Due Today", value: 0 },
    ]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [userError, setUserError] = useState(null);
    const [allUser, setAllUser] = useState([]);
    const [selectedAssignee, setSelectedAssignee] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const userData = await userDetails();
                setUser(userData);
            } catch (err) {
                setUserError(err.message);
            }
        }
        fetchUser();
    }, []);

    const assigneeObj = selectedAssignee ? { assignee: selectedAssignee } : {};

    useEffect(() => {
        async function getMetrics() {
            setLoading(true);
            setError(null);

            try {
                const [
                    completed,
                    pending,
                    total,
                    overdue,
                    completedThisMonth,
                    dueToday,
                ] = await Promise.all([
                    fetchTaskCount({ status: "completed", ...assigneeObj }),
                    fetchTaskCount({ status: "pending", ...assigneeObj }),
                    fetchTaskCount({ ...assigneeObj }),
                    overDue({ ...assigneeObj }),
                    thisMonth({ ...assigneeObj }),
                    fetchTaskCount({
                        due_date: new Date().toISOString().slice(0, 10),
                        ...assigneeObj,
                    }),
                ]);

                setMetrics([
                    { label: "Projects Completed", value: completed },
                    { label: "Pending Projects", value: pending },
                    { label: "Total Tasks", value: total },
                    { label: "Overdue Tasks", value: overdue },
                    {
                        label: "Tasks Completed This Month",
                        value: completedThisMonth,
                    },
                    { label: "Tasks Due Today", value: dueToday },
                ]);
            } catch (err) {
                setError(err.message);
            }

            setLoading(false);
        }

        getMetrics();
    }, [selectedAssignee]);

    const [tasksPerDayData, setTasksPerDayData] = useState({
        labels: Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toLocaleDateString("default", { weekday: "short" });
        }),
        datasets: [
            {
                label: "Tasks Completed",
                data: [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: "blue",
            },
        ],
    });

    useEffect(() => {
        async function fetchTasksPerDay() {
            try {
                let url = "http://localhost:8000/completedTasks";
                const params = new URLSearchParams(assigneeObj).toString();
                if (params) {
                    url += `?${params}`;
                }
                const response = await fetch(url);
                const result = await response.json();
                setTasksPerDayData((prev) => ({
                    ...prev,
                    datasets: [
                        {
                            ...prev.datasets[0],
                            data: result?.data || [0, 0, 0, 0, 0, 0, 0],
                        },
                    ],
                }));
            } catch (err) {
                console.error("Failed to fetch completed tasks:", err);
            }
        }
        fetchTasksPerDay();
    }, [selectedAssignee]);

    const handleAssigneeChange = (e) => {
        setSelectedAssignee(e.target.value);
    };

    const overdueTasksData = {
        labels: ["Overdue", "On Time"],
        datasets: [
            {
                data: [metrics[3].value, metrics[2].value - metrics[3].value],
                backgroundColor: ["#e74c3c", "#2ecc71"],
            },
        ],
    };

    const tasksByStatusData = {
        labels: ["Completed", "Pending", "Overdue"],
        datasets: [
            {
                label: "Tasks by Status",
                data: [metrics[0].value, metrics[1].value, metrics[3].value],
                backgroundColor: ["#2ecc71", "#f1c40f", "#e74c3c"],
            },
        ],
    };

    const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));
        return date.toLocaleString("default", { month: "short" });
    });

    const [tasksCreated, setTasksCreated] = useState(Array(12).fill(0));
    const [tasksCompleted, setTasksCompleted] = useState(Array(12).fill(0));

    useEffect(() => {
        async function fetchTasksCreatedVsCompleted() {
            try {
                let url = "http://localhost:8000/byMonths";
                const params = new URLSearchParams(assigneeObj).toString();
                if (params) {
                    url += `?${params}`;
                }
                const response = await fetch(url);
                const result = await response.json();
                setTasksCreated(result.created || Array(12).fill(0));
                setTasksCompleted(result.completed || Array(12).fill(0));
            } catch (err) {
                console.error(
                    "Failed to fetch tasks created vs completed:",
                    err
                );
            }
        }
        fetchTasksCreatedVsCompleted();
    }, []);

    useEffect(() => {
        axios
            .get("http://localhost:8000/userName", {
                // headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setAllUser(res.data);
            })
            .catch(() => {});
    }, []);

    const tasksCreatedVsCompletedData = {
        labels: months,
        datasets: [
            {
                label: "Tasks Created",
                data: tasksCreated,
                borderColor: "aqua",
                backgroundColor: "white",
                fill: true,
            },
            {
                label: "Tasks Completed",
                data: tasksCompleted,
                borderColor: "green",
                backgroundColor: "white",
                fill: true,
            },
        ],
    };

    //Charts
    const CHARTS = [
        {
            type: "Bar",
            component: Bar,
            data: tasksPerDayData,
            title: "Tasks Completed Per Day",
            options: {
                responsive: true,
                plugins: { legend: { position: "bottom" } },
            },
        },
        {
            type: "Pie",
            component: Pie,
            data: overdueTasksData,
            title: "Overdue vs On Time",
            options: {
                responsive: true,
                plugins: { legend: { position: "bottom" } },
                radius: "80%",
            },
        },
        {
            type: "Bar",
            component: Bar,
            data: tasksByStatusData,
            title: "Tasks by Status",
            options: {
                responsive: true,
                plugins: { legend: { position: "bottom" } },
            },
        },
        {
            type: "Line",
            component: Line,
            data: tasksCreatedVsCompletedData,
            title: "Tasks Created vs Completed (Monthly)",
            options: {
                responsive: true,
                plugins: { legend: { position: "bottom" } },
                scales: { y: { beginAtZero: true } },
            },
        },
    ];

    const [index, setIndex] = useState(0);
    const intervalRef = useRef(null);

    // Auto-scroll every 4 seconds
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setIndex((prev) => (prev + 1) % CHARTS.length);
        }, 6000);
        return () => clearInterval(intervalRef.current);
    }, [CHARTS.length]);

    // Manual navigation resets timer
    const goTo = (i) => {
        setIndex(i);
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setIndex((prev) => (prev + 1) % CHARTS.length);
        }, 4000);
    };

    const prev = () => goTo((index - 1 + CHARTS.length) % CHARTS.length);
    const next = () => goTo((index + 1) % CHARTS.length);

    const { component: ChartComponent, data, title, options } = CHARTS[index];

    const assigneeOptions = [
        { value: "", label: "All" },
        ...allUser.map((user) => ({
            value: user.id,
            label: user.name,
        })),
    ];

    return (
        <div class="apple">
            <Header user={user} />
            <NotificationBell assigneeId={user?.id} />

            {user?.post === "Master" && (
                <div
                    style={{
                        marginTop: "-30px",
                        marginBottom: 20,
                        display: "flex",

                        justifyContent: "center",
                        alignItems: "center",
                        border: "1px solid #e0e0e0",
                        padding: "16px 24px",
                        borderRadius: "10px",
                    }}
                >
                    <label styel={{ fontWeight: "bold" }}>
                        Select User:&nbsp;
                    </label>
                        {/* <select
                            value={selectedAssignee}
                            onChange={handleAssigneeChange}
                            style={{
                                padding: "8px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                                minWidth: "160px",
                            }}
                        >
                            <option value="">All</option>
                            {allUser.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name}
                                </option>
                            ))}
                        </select> */}
                        <Select
                            value={assigneeOptions.find(
                                (option) => option.value === selectedAssignee
                            )}
                            onChange={(selectedOption) =>
                                setSelectedAssignee(selectedOption?.value || "")
                            }
                            options={assigneeOptions}
                            isSearchable={true}
                            placeholder="Search assignees..."
                            noOptionsMessage={() => "No assignees found"}
                            styles={{
                                container: (provided) => ({
                                    ...provided,
                                    minWidth: "200px",
                                    width: "200px",
                                    maxWidth: "200px",
                                }),
                            }}
                        />
                    
                </div>
            )}

            {loading ? (
                <div>Loading metrics...</div>
            ) : error ? (
                <div style={{ color: "red" }}>{error}</div>
            ) : (
                <MetricCards metrics={metrics} />
            )}

            <div class="container">
                <button
                    class="arrow-btn left"
                    onClick={prev}
                    aria-label="Previous chart"
                >
                    &#8592;
                </button>
                <button
                    class="arrow-btn right"
                    onClick={next}
                    aria-label="Next chart"
                >
                    &#8594;
                </button>
                <div class="title">{title}</div>
                <div style={{ width: "100%", minHeight: 220 }}>
                    <ChartComponent data={data} options={options} />
                </div>
                <div class="dots">
                    {CHARTS.map((_, i) => (
                        <span
                            key={i}
                            className={`dot${i === index ? " active" : ""}`}
                            onClick={() => goTo(i)}
                            aria-label={`Go to chart ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

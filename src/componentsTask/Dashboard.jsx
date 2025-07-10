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
    const [recentActivities, setRecentActivities] = useState([]);
    const [todayTasks, setTodayTasks] = useState([]);
    const [activitiesLoading, setActivitiesLoading] = useState(true);
    const [todayTasksLoading, setTodayTasksLoading] = useState(true);

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

    // Fetch recent activities
    useEffect(() => {
        async function fetchRecentActivities() {
            setActivitiesLoading(true);
            try {
                let url = `${process.env.REACT_APP_API_URL}/recent-activities`;
                const params = new URLSearchParams(assigneeObj).toString();
                if (params) {
                    url += `?${params}`;
                }
                const response = await fetch(url);
                const result = await response.json();
                
                // Transform the notification data to match our expected format
                const transformedData = (result.data || result || []).map(activity => ({
                    id: activity.id,
                    title: activity.title,
                    description: activity.description,
                    status: activity.status === 'read' ? 'completed' : 'pending',
                    updated_at: activity.updated_at,
                    created_at: activity.created_at,
                    priority: 'medium', // Default priority since notifications don't have priority
                    type: activity.title.includes('Task Assigned') ? 'assignment' : 
                          activity.title.includes('Status Changed') ? 'status_change' : 'notification'
                }));
                
                setRecentActivities(transformedData);
                console.log("Recent Activities:", transformedData);
            } catch (err) {
                console.error("Failed to fetch recent activities:", err);
                setRecentActivities([]);
            }
            setActivitiesLoading(false);
        }
        fetchRecentActivities();
        console.log(recentActivities)
    }, [selectedAssignee]);

    // Fetch today's tasks for logged-in user
    useEffect(() => {
    async function fetchTodayTasks() {
        setTodayTasksLoading(true);
        try {
            let url = `${process.env.REACT_APP_API_URL}/dueToday`;
            const params = new URLSearchParams(assigneeObj).toString();
            if (params) {
                url += `?${params}`;
            }
            const response = await fetch(url);
            const result = await response.json();
            
            const transformedData = (result.data || result || []).map(task => ({
                id: task.id,
                title: task.title,
                description: task.description,
                status: task.status,
                updated_at: task.updated_at,
                created_at: task.created_at,
                due_date: task.due_date,
                priority: task.priority || 'medium',
                assignee: task.assignee,
                project_name: task.project_name,
                type: 'task'
            }));
            
            setTodayTasks(transformedData);
            console.log("Today's Tasks:", transformedData);
        } catch (err) {
            console.error("Failed to fetch today's tasks:", err);
            setTodayTasks([]);
        }
        setTodayTasksLoading(false);
    }
    fetchTodayTasks();
    console.log(todayTasks);
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
                let url = `${process.env.REACT_APP_API_URL}/completedTasks`;
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
               setError("Failed to fetch completed tasks:", err);
            }
        }
        fetchTasksPerDay();
    }, [selectedAssignee]);

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
                let url = `${process.env.REACT_APP_API_URL}/byMonths`;
                const params = new URLSearchParams(assigneeObj).toString();
                if (params) {
                    url += `?${params}`;
                }
                const response = await fetch(url);
                const result = await response.json();
                setTasksCreated(result.created || Array(12).fill(0));
                setTasksCompleted(result.completed || Array(12).fill(0));
            } catch (err) {
                setError(
                    "Failed to fetch tasks created vs completed:",
                    err
                );
            }
        }
        fetchTasksCreatedVsCompleted();
    }, []);

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/userName`, {
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

    // Common chart options with consistent sizing
    const commonChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
            legend: { 
                position: "bottom",
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    font: {
                        size: 12
                    }
                }
            }
        },
        layout: {
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10
            }
        }
    };

    // Specific options for pie charts to control size
    const pieChartOptions = {
        ...commonChartOptions,
        plugins: {
            ...commonChartOptions.plugins,
            legend: {
                ...commonChartOptions.plugins.legend,
                position: "bottom"
            }
        },
        elements: {
            arc: {
                borderWidth: 2
            }
        },
        // Control pie chart size
        cutout: 0, // For pie chart (not doughnut)
        radius: "70%", // Limit the pie chart size
    };

    // Specific options for bar charts
    const barChartOptions = {
        ...commonChartOptions,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    color: '#f0f0f0'
                },
                ticks: {
                    font: {
                        size: 11
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 11
                    }
                }
            }
        }
    };

    // Specific options for line charts
    const lineChartOptions = {
        ...commonChartOptions,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    color: '#f0f0f0'
                },
                ticks: {
                    font: {
                        size: 11
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 11
                    }
                }
            }
        }
    };

    //Charts with consistent sizing
    const CHARTS = [
        {
            type: "Bar",
            component: Bar,
            data: tasksPerDayData,
            title: "Tasks Completed Per Day",
            options: barChartOptions,
        },
        {
            type: "Pie",
            component: Pie,
            data: overdueTasksData,
            title: "Overdue vs On Time",
            options: pieChartOptions,
        },
        {
            type: "Bar",
            component: Bar,
            data: tasksByStatusData,
            title: "Tasks by Status",
            options: barChartOptions,
        },
        {
            type: "Line",
            component: Line,
            data: tasksCreatedVsCompletedData,
            title: "Tasks Created vs Completed (Monthly)",
            options: lineChartOptions,
        },
    ];

    const [index, setIndex] = useState(0);
    const intervalRef = useRef(null);

    // Auto-scroll every 6 seconds
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
        }, 6000);
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return '#10b981';
            case 'pending':
                return '#f59e0b';
            case 'overdue':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return '#ef4444';
            case 'medium':
                return '#f59e0b';
            case 'low':
                return '#10b981';
            default:
                return '#6b7280';
        }
    };

    return (
        <div className="apple">
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
                    <label style={{ fontWeight: "bold" }}>
                        Select User:&nbsp;
                    </label>
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

            {/* Dashboard Layout with Charts and Activity Columns */}
            <div className="dashboard-layout">
                {/* Charts Section */}
                <div className="charts-section">
                    <div className="container">
                        <button
                            className="arrow-btn left"
                            onClick={prev}
                            aria-label="Previous chart"
                        >
                            &#8592;
                        </button>
                        <button
                            className="arrow-btn right"
                            onClick={next}
                            aria-label="Next chart"
                        >
                            &#8594;
                        </button>
                        <div className="title">{title}</div>
                        <div className="chart-container">
                            <ChartComponent data={data} options={options} />
                        </div>
                        <div className="dots">
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

                {/* Activity Columns */}
                <div className="activity-columns">
                    {/* Recent Activities */}
                    <div className="activity-card">
                        <div className="activity-header">
                            <h3>Recent Activities</h3>
                            <div className="activity-icon"></div>
                        </div>
                        <div className="activity-content">
                            {activitiesLoading ? (
                                <div className="loading-state">
                                    <div className="spinner"></div>
                                    <span>Loading activities...</span>
                                </div>
                            ) : recentActivities.length > 0 ? (
                                <div className="activity-list">
                                    {recentActivities.map((activity, index) => (
                                        <div key={index} className="activity-item">
                                            <div className="activity-info">
                                                <div className="activity-title">{activity.title}</div>
                                                <div className="activity-meta">
                                                    <span className="activity-status" 
                                                          style={{ color: getStatusColor(activity.status) }}>
                                                        {activity.status}
                                                    </span>
                                                    <span className="activity-date">
                                                        {formatDate(activity.updated_at)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="activity-priority" 
                                                 style={{ backgroundColor: getPriorityColor(activity.priority) }}>
                                                {activity.priority}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-icon">📋</div>
                                    <p>No recent activities found</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tasks Due Today */}
                    <div className="activity-card">
                        <div className="activity-header">
                            <h3>Tasks Due Today</h3>
                            <div className="activity-icon"></div>
                        </div>
                        <div className="activity-content">
                            {todayTasksLoading ? (
                                <div className="loading-state">
                                    <div className="spinner"></div>
                                    <span>Loading today's tasks...</span>
                                </div>
                            ) : todayTasks.length > 0 ? (
                                <div className="activity-list">
                                    {todayTasks.map((task, index) => (
                                        <div key={index} className="activity-item">
                                            <div className="activity-info">
                                                <div className="activity-title">{task.title}</div>
                                                <div className="activity-meta">
                                                    <span className="activity-status" 
                                                          style={{ color: getStatusColor(task.status) }}>
                                                        {task.status}
                                                    </span>
                                                    <span className="activity-assignee">
                                                        {task.assignee_name || 'Unassigned'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="activity-priority" 
                                                 style={{ backgroundColor: getPriorityColor(task.priority) }}>
                                                {task.priority}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-icon"></div>
                                    <p>You have no tasks due today!</p>
                                    <small>Great job staying on top of your work!</small>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
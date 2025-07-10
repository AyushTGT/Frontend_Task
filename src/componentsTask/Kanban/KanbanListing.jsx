import React, { useEffect, useState } from "react";
import { KanbanBoardContainer, KanbanBoard } from "./KanbanBoard.jsx";
import { KanbanColumn } from "./KanbanColumn.jsx";
import { KanbanItem } from "./KanbanItem.jsx";
import { ProjectCardMemo } from "./KanbanCard.jsx";
import TaskDetailModal from "../../modals/TaskDetailModal.jsx";
import axios from "axios";
import Cookies from "js-cookie";
import ErrorModal from "../../modals/ErrorModal.jsx";
import SuccessModal from "../../modals/SuccessModal.jsx";

const KANBAN_STAGES = [
    { id: "unassigned", title: "UNASSIGNED", apiStatus: "unassigned" },
    { id: "pending", title: "PENDING", apiStatus: "pending" },
    { id: "overdue", title: "OVERDUE", apiStatus: "overdue" },
    { id: "completed", title: "COMPLETED", apiStatus: "completed" },
    { id: "cancelled", title: "CANCELLED", apiStatus: "cancelled" },
];

function mapStatusToColumn(status, due_date) {
    if (!status) return "unassigned";

    if (status === "pending" && due_date) {
        const due = new Date(due_date);
        const today = new Date();
        if (due < today.setHours(0, 0, 0, 0)) return "overdue";
    }
    if (status === "overdue") return "overdue";
    if (status === "unassigned") return "unassigned";
    if (status === "pending") return "pending";
    if (status === "completed") return "completed";
    if (status === "cancelled") return "cancelled";
    return "unassigned";
}

export function TasksListPage({ user }) {
    const [allTasks, setAllTasks] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [modalTask, setModalTask] = useState(null);
    const [taskDetailOpen, setTaskDetailOpen] = useState(false);
    const token = Cookies.get("jwt_token");
    const [reporterOptions, setReporterOptions] = useState([]);
    const [errors, setErrors] = useState(null);
    const [success, setSuccess] = useState(null);

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

    async function fetchTasks() {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/getTasks`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success && Array.isArray(result.tasks)) {
                const mappedTasks = result.tasks.map((task) => ({
                    id: String(task.id),
                    title: task.title,
                    dueDate: task.due_date,
                    stageId: mapStatusToColumn(task.status, task.due_date),
                    users: task.assignee
                        ? [
                              {
                                  id: String(task.assignee),
                                  name: task.assignee_name || "Assignee",
                              },
                          ]
                        : [],
                    updatedAt: task.updated_at,
                    _raw: task,
                }));
                setAllTasks(mappedTasks);
                setTasks(mappedTasks);
            } else {
                setAllTasks([]);
                setTasks([]);
            }
        } catch (error) {
            console.error("Failed to fetch tasks:", error.message || error);
            setAllTasks([]);
            setTasks([]);
        }
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleTaskUpdate = async (updatedTask) => {
        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/updateTask/${updatedTask.id}`,
                updatedTask,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setTaskDetailOpen(false);
            fetchTasks();
            setSuccess("Task updated successfully");
        } catch (err) {
            setTaskDetailOpen(false);
            setErrors(
                "Error updating task: " +
                    (err.response?.data?.message || err.message)
            );
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    };

    const handleRowClick = (task) => {
        setModalTask({ ...task._raw, ...task });
        setTaskDetailOpen(true);
    };

    const columns = KANBAN_STAGES.map((stage) => ({
        ...stage,
        tasks: tasks.filter((task) => task.stageId === stage.id),
    }));

    function handleOnDragEnd(event) {
        const { active, over } = event;
        if (!over) return;
        const taskId = active.id;
        const newStageId = over.id;
        setTasks((prev) =>
            prev.map((task) =>
                task.id === taskId ? { ...task, stageId: newStageId } : task
            )
        );
        const updatedTask = tasks.find((task) => task.id === taskId);
        if (updatedTask && updatedTask.stageId !== newStageId) {
            axios
                .put(
                    `${process.env.REACT_APP_API_URL}/updateTaskStatus/${taskId}`,
                    {
                        ...updatedTask._raw,
                        status: newStageId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then(() => {
                    fetchTasks();
                })
                .catch((err) => {
                    setErrors(
                        "Error updating task status: " +
                            (err.response?.data?.error ||
                                err.response?.data?.message ||
                                err.message)
                    );
                    fetchTasks();
                });
        }
    }

    const isLoading = false;

    return (
        <>
            <KanbanBoardContainer>
                <KanbanBoard onDragEnd={handleOnDragEnd}>
                    {columns.map((column) => (
                        <KanbanColumn
                            key={column.id}
                            id={column.id}
                            title={column.title}
                            count={column.tasks.length}
                        >
                            {!isLoading &&
                                column.tasks.map((task) => {
                                    
                                    return (
                                        <KanbanItem
                                            key={task.id}
                                            id={task.id}
                                            data={task}
                                            // user={user}
                                            // disabled={
                                            //     task?.users[0]?.id !== user?.id
                                            // }
                                        >
                                            <ProjectCardMemo
                                                user={user}
                                                {...task}
                                                dueDate={
                                                    task.dueDate || undefined
                                                }
                                                status={task.stageId}
                                                priority={task._raw.priority}
                                                users={task.users}
                                                assignee={reporterOptions?.find((u) => u.id === task._raw.assignee)?.name}
                                                onView={() =>
                                                    handleRowClick(task)
                                                }
                                            />
                                        </KanbanItem>
                                    );
                                })}
                        </KanbanColumn>
                    ))}
                </KanbanBoard>
            </KanbanBoardContainer>

            <TaskDetailModal
                open={taskDetailOpen}
                onClose={() => {setTaskDetailOpen(false); window.location.reload();}}
                task={modalTask}
                onUpdate={handleTaskUpdate}
                userOptions={reporterOptions}
                user={user}
            />

            <ErrorModal
                open={!!errors}
                message={errors}
                onClose={() => setErrors("")}
            />
            <SuccessModal
                open={!!success}
                message={success}
                onClose={() => setSuccess("")}
                title="Successful"
            />
        </>
    );
}

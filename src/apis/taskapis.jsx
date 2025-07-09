import Cookies from "js-cookie";
import { getToken } from "../utils/utils.jsx";
const BASE_URL = `${process.env.REACT_APP_API_URL}/`;

export async function fetchTaskCount(params = {}) {
    // Build query string from params object
    const query = new URLSearchParams(params).toString();
    const url = `${BASE_URL}/countTasks${query ? `?${query}` : ""}`;

    const response = await fetch(url, {
        headers: {
            Accept: "application/json",
            // Add Authorization or other headers if required
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch task count");
    }
    const data = await response.json();
    return data.count;
}

export async function overDue(params = {}) {
    const token = getToken();

    const query = new URLSearchParams(params).toString();
    const url = `${BASE_URL}/overdueTasks${query ? `?${query}` : ""}`;
    //const url = `${BASE_URL}/overdueTasks`;

    const response = await fetch(url, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Failed to fetch overdue tasks");
    const data = await response.json();
    return data.count;
}  

export async function userDetails() {
    // Build query string from params object
    const token = getToken();
    const url = `${BASE_URL}/me`;

    const response = await fetch(url, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (response.status === 401) {
        alert("Session expired. Please log in again.");
        window.location.href = "/login";
        return;
    }
    if (!response.ok) throw new Error("Failed to fetch user");
    const data = await response.json();
    return data;
}


export async function thisMonth(params = {}) {
    const token = getToken();

    const query = new URLSearchParams(params).toString();
    const url = `${BASE_URL}/taskCompletedThisMonth${query ? `?${query}` : ""}`;
    //const url = `${BASE_URL}/taskCompletedThisMonth`;

    const response = await fetch(url, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Failed to fetch tasks for this month");
    const data = await response.json();
    return data.count;
}

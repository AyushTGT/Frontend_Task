import Cookies from "js-cookie";

//Api call to get user details
export async function getUsers({
    search,
    sort,
    order,
    per_page,
    post,
    page,
}) {
    // Filter out undefined, null, or empty values
    const filteredParams = Object.fromEntries(
        Object.entries({ search, sort, order, per_page, post, page }).filter(
            ([_, v]) => v !== undefined && v !== null && v !== ""
        )
    );

    const params = new URLSearchParams(filteredParams);
    const token = Cookies.get("jwt_token");

    const res = await fetch(`${process.env.REACT_APP_API_URL}/getUsers?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
        throw new Error("SessionExpired");
    }

    const data = await res.json();
    return data;
}

//Api call to get user details for profile using token
export async function getProfile() {
    const token = Cookies.get("jwt_token");
    const res = await fetch(`${process.env.REACT_APP_API_URL}/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch profile");
    }
    const data = await res.json();
    return data;
}
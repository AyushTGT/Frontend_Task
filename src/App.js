import React, { useEffect } from "react";
import "./App.css";
import RegisterPage from "./components/Register";
import Header from "./components/Header";
import { Routes, Route, Outlet } from "react-router-dom";
import TermsAndConditions from "./components/Terms";
import LoginPage from "./components/Login";
import VerifyEmail from "./components/verifiedEmail";
import Dashboard from "./components/Dashboard";
import ForgetPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Home from "./componentsTask/Home";
import Tasklisting from "./componentsTask/Tasklisting";
import Sidebar from "./componentsTask/Sidebar";
import AllTasks from "./componentsTask/AllTasks";
import SidebarUser from "./components/Sidebar";
import { useDispatch } from "react-redux";
import { fetchProfile } from "./redux/profileActions";
import { useSelector } from "react-redux";

// import * as PusherPushNotifications from "@pusher/push-notifications-web";

// Layout for pages with Sidebar
function SidebarLayout() {
    return (
        <div className="sidebar-layout">
            <Sidebar />
            <div className="sidebar-content">
                <Outlet />
            </div>
        </div>
    );
}
function SidebarLayoutUser() {
    return (
        <div className="sidebar-layout">
            <SidebarUser />
            <div className="sidebar-content">
                <Outlet />
            </div>
        </div>
    );
}

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    //     Notification.requestPermission().then(permission => {
    //             if (permission !== "granted") {
    //                 alert("Notifications are required for this feature.");
    //             }
    //         });

    //     useEffect(() => {
    //         const beamsClient = new PusherPushNotifications.Client({
    //             instanceId: "13712aae-8078-4d6c-9ab9-9e45827c4ee0",
    //         });

    //         beamsClient
    //             .start()
    //             .then(() => beamsClient.addDeviceInterest("debug-apple"))
    //             .then(() => console.log("Successfully registered and subscribed!"))
    //             .catch(console.error);
    //     }, []);

    return (
        <div className="app-bg">
            <Routes>
                {/* Routes with sidebar */}
                <Route element={<SidebarLayout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/tasks" element={<Tasklisting />} />
                    <Route path="/tasklisting" element={<AllTasks />} />
                </Route>

                <Route element={<SidebarLayoutUser />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>

                {/* All other routes */}
                <Route path="/" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/verified" element={<VerifyEmail />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/forget" element={<ForgetPassword />} />
                <Route path="/reset" element={<ResetPassword />} />
            </Routes>
        </div>
    );
}

export default App;

import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import AdminDashboard from "./dashboards/AdminDashboard";
import VolunteerDashboard from "./dashboards/VolunteerDashboard";
import TeacherDashboard from "./dashboards/TeacherDashboard";
import StudentDashboard from "./dashboards/StudentDashboard";

const Dashboard = () => {
    const { user } = useAuth();

    const renderDashboard = () => {
        switch (user.role.toLowerCase()) {
            case "admin":
                return <AdminDashboard />;
            case "volunteer":
                return <VolunteerDashboard />;
            case "teacher":
                return <TeacherDashboard />;
            case "student":
                return <StudentDashboard />;
            default:
                return (
                    <div className="text-white">
                        Tipo de usuário não reconhecido
                    </div>
                );
        }
    };

    return <div className="min-h-screen p-4 md:p-8">{renderDashboard()}</div>;
};

export default Dashboard;

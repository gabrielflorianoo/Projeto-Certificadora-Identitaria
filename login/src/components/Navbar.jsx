import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const getRoleDisplayName = (role) => {
        const roleNames = {
            admin: "Administrador(a)",
            volunteer: "Voluntário(a)",
            teacher: "Professor(a)",
            student: "Aluno(a)",
        };
        return roleNames[role.toLowerCase()] || role;
    };

    const getNavigationItems = () => {
        const items = [];

        switch (user.role.toLowerCase()) {
            case "admin":
                items.push(
                    { label: "Dashboard", path: "/dashboard" },
                    { label: "Usuários", path: "/users" },
                    { label: "Voluntários", path: "/volunteers" },
                    { label: "Alunos", path: "/students" },
                    { label: "Turmas", path: "/classes" },
                    { label: "Presença", path: "/attendance" },
                    { label: "Notas", path: "/grades" },
                    { label: "Relatórios", path: "/reports" },
                );
                break;
            case "volunteer":
                items.push(
                    { label: "Dashboard", path: "/dashboard" },
                    { label: "Presença", path: "/attendance" },
                    { label: "Notas", path: "/grades" },
                    { label: "Alunos", path: "/students" },
                );
                break;
            case "teacher":
                items.push(
                    { label: "Dashboard", path: "/dashboard" },
                    { label: "Voluntários", path: "/volunteers" },
                    { label: "Alunos", path: "/students" },
                    { label: "Presença", path: "/attendance" },
                    { label: "Notas", path: "/grades" },
                    { label: "Relatórios", path: "/reports" },
                    { label: "Analytics", path: "/analytics" },
                );
                break;
            case "student":
                items.push(
                    { label: "Dashboard", path: "/dashboard" },
                );
                break;
            default:
                items.push({ label: "Dashboard", path: "/dashboard" });
        }

        return items;
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/10 backdrop-blur-md border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link
                            to="/dashboard"
                            className="text-white font-bold text-xl animate-float"
                        >
                            ELLP Sistema
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {getNavigationItems().map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            <div className="text-white text-sm mr-4">
                                <div className="font-semibold">{user.name}</div>
                                <div className="text-blue-200 text-xs">
                                    {getRoleDisplayName(user.role)}
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                            >
                                Sair
                            </button>
                        </div>
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white hover:text-blue-200 p-2"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/5 backdrop-blur-md">
                        {getNavigationItems().map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="text-white hover:text-blue-200 block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="border-t border-white/20 pt-2 mt-2">
                            <div className="text-white px-3 py-2">
                                <div className="font-semibold">{user.name}</div>
                                <div className="text-blue-200 text-sm">
                                    {getRoleDisplayName(user.role)}
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-red-300 hover:text-red-200 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

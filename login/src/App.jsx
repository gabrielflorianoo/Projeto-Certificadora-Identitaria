import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Volunteers from "./pages/Volunteers";
import Students from "./pages/Students";
import Classes from "./pages/Classes";
import Reports from "./pages/Reports";
import Attendance from "./pages/Attendance";
import Grades from "./pages/Grades";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <AuthProvider>
                <DataProvider>
                    <BrowserRouter>
                        <Layout>
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route
                                    path="/unauthorized"
                                    element={<Unauthorized />}
                                />
                                <Route
                                    path="/dashboard"
                                    element={
                                        <ProtectedRoute>
                                            <Dashboard />
                                        </ProtectedRoute>
                                    }
                                />                                <Route
                                    path="/users"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={["admin"]}
                                        >
                                            <Users />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/volunteers"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={[
                                                "admin",
                                                "teacher",
                                            ]}
                                        >
                                            <Volunteers />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/students"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={[
                                                "admin",
                                                "teacher",
                                            ]}
                                        >
                                            <Students />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/classes"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={["admin"]}
                                        >
                                            <Classes />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/reports"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={[
                                                "admin",
                                                "teacher",
                                            ]}
                                        >
                                            <Reports />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/attendance"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={[
                                                "admin",
                                                "teacher",
                                                "volunteer",
                                            ]}
                                        >
                                            <Attendance />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/grades"
                                    element={
                                        <ProtectedRoute
                                            allowedRoles={[
                                                "admin",
                                                "teacher",
                                                "volunteer",
                                            ]}
                                        >
                                            <Grades />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/"
                                    element={
                                        <Navigate to="/dashboard" replace />
                                    }
                                />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Layout>
                    </BrowserRouter>
                </DataProvider>
            </AuthProvider>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;

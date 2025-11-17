import React from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#021738] via-[#103c47] to-[#031622] animate-gradient-move bg-[length:400%_400%]">
            {user && <Navbar />}
            <main className={user ? "pt-20" : ""}>{children}</main>
        </div>
    );
};

export default Layout;

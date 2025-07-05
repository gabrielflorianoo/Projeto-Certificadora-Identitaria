import { createContext, useContext, useState, useEffect } from "react";
import { getUserProfile, loginUser } from "../lib/server";
import config from "../config/index.js";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Função para validar token com o servidor
    const validateToken = async () => {
        try {
            const userData = await getUserProfile();
            setUser(userData);
            localStorage.setItem(config.USER_KEY, JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error("Token validation failed:", error);
            logout();
            return false;
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem(config.TOKEN_KEY);
            const storedUser = localStorage.getItem(config.USER_KEY);

            if (token) {
                if (storedUser) {
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch (error) {
                        console.error("Error parsing user data:", error);
                    }
                }
                
                // Validar token com servidor
                await validateToken();
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);
            const data = await loginUser({ email, password });

            localStorage.setItem(config.TOKEN_KEY, data.token);
            localStorage.setItem(config.USER_KEY, JSON.stringify(data.user));
            setUser(data.user);

            return { success: true, user: data.user };
        } catch (error) {
            console.error("Login failed:", error);
            return { 
                success: false, 
                error: error.error || error.message || "Credenciais inválidas" 
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem(config.TOKEN_KEY);
        localStorage.removeItem(config.USER_KEY);
        setUser(null);
    };

    const updateUser = (userData) => {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem(config.USER_KEY, JSON.stringify(updatedUser));
    };

    const value = {
        user,
        login,
        logout,
        updateUser,
        validateToken,
        loading,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

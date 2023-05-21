import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user is authenticated on mount
        // Set isAuthenticated and user state accordingly
        const token = localStorage.getItem("x-auth-token");
        if (token) {
            fetch("http://localhost:8000/api/userinformation", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Authentication failed");
                    }
                    return response.json();
                })
                .then((data) => {
                    setIsAuthenticated(true);
                    setUser(data);
                    navigate("/")
                })
                .catch((error) => {
                    console.error(error);
                    setIsAuthenticated(false);
                    setUser(null);
                });
        }
    }, [navigate]);

    const login = async (email, password) => {
        try {
            const response = await fetch("http://localhost:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("x-auth-token", data["x-auth-token"]);
                setIsAuthenticated(true);
                setUser(data.user);
                navigate("/")
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error(error);
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    const register = async (firstName, lastName, email, password) => {
        try {
            const response = await fetch("http://localhost:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("x-auth-token", data["x-auth-token"]);
                setIsAuthenticated(true);
                setUser(data.user);
                navigate("/")
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error(error);
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    const logout = () => {
        localStorage.removeItem("x-auth-token");
        setIsAuthenticated(false);
        setUser(null);
    };

    const value = { isAuthenticated, user, login, register, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used witahin an AuthProvider");
    }
    return context;
}

export { AuthProvider, AuthContext, useAuth };
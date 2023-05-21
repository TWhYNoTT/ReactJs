import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
const URL = process.env.REACT_APP_API_URL;


function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);


    useEffect(() => {
        console.log(URL)
        // Check if user is authenticated on mount
        // Set isAuthenticated and user state accordingly
        setToken(localStorage.getItem("x-auth-token"));
        if (token) {
            fetch(`${URL}/userinformation`, {
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
    }, [navigate, token]);


    const register = async (firstName, lastName, email, password) => {
        try {
            const response = await fetch(`${URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("x-auth-token", data["x-auth-token"]);
                setToken(localStorage.getItem("x-auth-token"));
                setIsAuthenticated(true);
                setUser(data.user);
                navigate("/")
            } else {
                return data.message;
            }
        } catch (error) {
            console.error(error);
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch(`${URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("x-auth-token", data["x-auth-token"]);
                setToken(localStorage.getItem("x-auth-token"));
                setIsAuthenticated(true);
                setUser(data.user);
                navigate("/")
            } else {
                return data.message

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
        setToken(null);
        setUser(null);
    };


    const fetchPosts = async (page) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${URL}/post?page=${page}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token,
                },
            });
            const data = await response.json();
            setPosts((prevPosts) => [...prevPosts, ...data.posts]);
            setIsLoading(false);
            setHasMore(data.posts.length > 0);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    const createPost = async (header, body, image) => {
        try {
            const formData = new FormData();
            formData.append("header", header);
            formData.append("body", body);
            formData.append("image", image);

            const response = await fetch(`${URL}/post`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify({ header, body })
            });

            const data = await response.json();
            return data.message;

        } catch (error) {
            console.error(error);
            return { success: false, message: error.message };
        }
    }

    const updatePost = async (postId, editedPost) => {
        try {
            const response = await fetch(`${URL}/post/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify(editedPost)
            });

            if (response.ok) {
                return true;
            } else {
                throw new Error('Failed to update post');
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const deletePost = async (postId) => {
        try {

            const response = await fetch(`${URL}/post/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                }
            });

            if (response.ok) {
                return true;
            } else {
                throw new Error('Failed to delete post');
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    };




    const value = { isAuthenticated, user, login, register, logout, updatePost, deletePost, createPost, fetchPosts, posts, hasMore, isLoading };

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
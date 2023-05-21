import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import request from "../api/request";

const ApiContext = createContext();

function ApiProvider({ children }) {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);


    useEffect(() => {

        // Check if user is authenticated on mount
        // Set isAuthenticated and user state accordingly
        setToken(localStorage.getItem("x-auth-token"));
        if (token) {
            getUserInformation();
        }
    }, [token]);


    const getUserInformation = async () => {
        const data = await request("GET", `userinformation`, null, token);
        if (data.isOK) {
            setUser(data.responseData);
            setIsAuthenticated(true);
            navigate("/")
        } else {
            setIsAuthenticated(false);
            setUser(null);
        }

    };


    const register = async (firstName, lastName, email, password) => {
        const data = await request("POST", "register", { firstName, lastName, email, password });
        if (data.isOK) {
            auth(data.responseData)
        } else {
            return data.responseData.message;
        }

    };


    const login = async (email, password) => {
        const data = await request("POST", "login", { email, password });
        if (data.isOK) {
            auth(data.responseData)
        } else {
            return data.responseData.message;
        }

    };

    const fetchPosts = async (page) => {
        setIsLoading(true);
        const data = await request("GET", `post?page=${page}`);
        if (data.isOK) {
            setPosts((prevPosts) => [...prevPosts, ...data.responseData.posts]);
            setHasMore(data.responseData.posts.length > 0);
            setIsLoading(false);
        } else {
            return data.responseData.message;
        }

    };

    const createPost = async (header, body, image) => {
        const data = await request("POST", `post`, { header, body }, token);
        return data.responseData.message;
    };


    const updatePost = async (postId, editedPost) => {
        const data = await request("PUT", `post/${postId}`, editedPost, token);
        return data.responseData.message;
    };



    const deletePost = async (postId) => {
        const data = await request("DELETE", `post/${postId}`, null, token);
        return data.responseData.message;
    };


    // This function is called when register ot login
    const auth = (responseData) => {
        localStorage.setItem("x-auth-token", responseData["x-auth-token"]);
        setToken(localStorage.getItem("x-auth-token"));
        setIsAuthenticated(true);
        setUser(responseData.user);
        navigate("/")
    }

    const logout = () => {
        localStorage.removeItem("x-auth-token");
        setIsAuthenticated(false);
        setToken(null);
        setUser(null);
    };

    const value = { isAuthenticated, user, login, register, logout, updatePost, deletePost, createPost, fetchPosts, posts, hasMore, isLoading };

    return (
        <ApiContext.Provider value={value}>
            {children}
        </ApiContext.Provider>
    );
}

function useAuth() {
    const context = React.useContext(ApiContext);
    if (context === undefined) {
        throw new Error("useAuth must be used witahin an AuthProvider");
    }
    return context;
}

export { ApiProvider, ApiContext, useAuth };
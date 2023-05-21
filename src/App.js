import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ApiProvider } from "./context/ApiContext";
import Navbar from "./components/NavBar";

import PostList from "./components/PostList";
import Login from "./components/Login";
import Register from "./components/Register";


function App() {
  return (
    <ApiProvider>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

    </ApiProvider>
  );
}

export default App;
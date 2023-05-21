import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


function Navbar() {
    const { isAuthenticated, user, logout } = useContext(AuthContext);

    const guestLinks = (
        <ul>
            <li>
                <NavLink to="/login">Login</NavLink>
            </li>
            <li>
                <NavLink to="/register">Register</NavLink>
            </li>
        </ul>
    );

    const authLinks = (
        <ul>
            <li>Hello, {user && user.fullname}</li>

            <li>
                <button onClick={logout}>Logout</button>
            </li>
        </ul>
    );

    return (
        <nav>
            <h1>Blog</h1>
            <ul>
                <li>
                    <NavLink exact to="/" activeClassName="active">
                        Home
                    </NavLink>
                </li>
                {isAuthenticated ? authLinks : guestLinks}
            </ul>
        </nav>
    );
}

export default Navbar;
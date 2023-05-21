import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useContext(AuthContext);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault(); // prevent form submission

        const emailRegex = /\S+@\S+\.\S+/; // regular expression for email validation
        if (!emailRegex.test(email)) {
            setError("Invalid email address");
            return;
        }

        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+-=[\]{}|;':",./<>?]).{8,}$/; // regular expression for a complex password
        if (!passwordRegex.test(password)) {
            setError("Invalid password");
            return;
        }

        try {
            await login(email, password); // call the login method from the AuthContext
            setError(""); // clear any existing error messages
        } catch (error) {
            console.error(error);
            setError("Invalid email or password");
        }
    };

    return (
        <form onSubmit={handleLoginSubmit}>
            <label>
                Email:
                <input type="email" value={email} onChange={handleEmailChange} />
            </label>
            <label>
                Password:
                <input type="password" value={password} onChange={handlePasswordChange} />
            </label>
            <button type="submit">Login</button>
            {error && <p className="error">{error}</p>}
        </form>
    );
};

export default LoginForm;
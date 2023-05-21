import React, { useState, useContext } from "react";
import { ApiContext } from "../context/ApiContext";

const RegistrationForm = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const { register } = useContext(ApiContext);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleRepeatPasswordChange = (event) => {
        setRepeatPassword(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleRegisterSubmit = async (event) => {
        event.preventDefault(); // prevent form submission

        if (firstName.length < 3) {
            setError("First name must be at least 3 characters");
            return;
        }

        if (lastName.length < 3) {
            setError("Last name must be at least 3 characters");
            return;
        }

        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+-=[\]{}|;':",./<>?]).{8,}$/; // regular expression for a complex password
        if (!passwordRegex.test(password)) {
            setError(
                "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one symbol"
            );
            return;
        }

        if (password !== repeatPassword) {
            setError("Passwords do not match");
            return;
        }

        const emailRegex = /\S+@\S+\.\S+/; // regular expression for email validation
        if (!emailRegex.test(email)) {
            setError("Invalid email address");
            return;
        }
        setIsSubmitting(true)
        const message = await register(firstName, lastName, email, password);
        setIsSubmitting(false)
        if (message) {
            setError(message);
            return;
        }
        setError(""); // clear any existing error messages
    };

    return (
        <form onSubmit={handleRegisterSubmit}>
            <label>
                First name:
                <input type="text" value={firstName} onChange={handleFirstNameChange} />
            </label>
            <label>
                Last name:
                <input type="text" value={lastName} onChange={handleLastNameChange} />
            </label>
            <label>
                Password:
                <input type="password" value={password} onChange={handlePasswordChange} />
            </label>
            <label>
                Repeat password:
                <input
                    type="password"
                    value={repeatPassword}
                    onChange={handleRepeatPasswordChange}
                />
            </label>
            <label>
                Email:
                <input type="email" value={email} onChange={handleEmailChange} />
            </label>
            {!isSubmitting && (<button type="submit">Register</button>)}
            {error && <p className="error">{error}</p>}
        </form>
    );
};

export default RegistrationForm;
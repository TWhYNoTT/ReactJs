import React, { useState } from "react";

function NewPost() {
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubjectChange = (event) => {
        setSubject(event.target.value);
    };

    const handleBodyChange = (event) => {
        setBody(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (subject.length < 3) {
            setErrorMessage("Subject must be at least three characters long.");
            return;
        }

        if (body.length < 3) {
            setErrorMessage("Body must be at least three characters long.");
            return;
        }

        const response = await fetch('http://localhost:8000/api/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('x-auth-token')
            },
            body: JSON.stringify({
                header: subject,
                body: body
            })
        });
        const data = await response.json();
        console.log(data)
        if (response.ok) {

        }
        setSubject("");
        setBody("");
        setErrorMessage("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Subject:
                <input type="text" value={subject} onChange={handleSubjectChange} />
            </label>
            <label>
                Body:
                <textarea value={body} onChange={handleBodyChange}></textarea>
            </label>
            {errorMessage && (
                <p style={{ color: "red" }}>{errorMessage}</p>
            )}
            <button type="submit">Post</button>
        </form>
    );
}

export default NewPost;
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function NewPost() {
    const { createPost } = useContext(AuthContext);
    const [header, setHeader] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleHeaderChange = (event) => {
        setHeader(event.target.value);
    };

    const handleBodyChange = (event) => {
        setBody(event.target.value);
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);

    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (header.length < 3) {
            setErrorMessage("Subject must be at least three characters long.");
            return;
        }

        if (body.length < 3) {
            setErrorMessage("Body must be at least three characters long.");
            return;
        }
        setIsSubmitting(true)
        const message = await createPost(header, body, image);

        setErrorMessage(message);

        setIsSubmitting(false)
        setHeader("");
        setBody("");
        setImage("");
        setErrorMessage("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Subject:
                <input type="text" value={header} onChange={handleHeaderChange} />
            </label>
            <label>
                Body:
                <textarea value={body} onChange={handleBodyChange}></textarea>
            </label>
            <label htmlFor="image">Image:</label>
            <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}

            />
            {errorMessage && (
                <p style={{ color: "red" }}>{errorMessage}</p>
            )}

            {!isSubmitting && (<button type="submit">Post</button>)}
        </form>
    );
}

export default NewPost;
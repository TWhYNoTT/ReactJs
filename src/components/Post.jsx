import React, { useState, useContext } from 'react';
import { AuthContext } from "../context/AuthContext";

const Post = ({ post }) => {
    const [editedPost, setEditedPost] = useState({ header: post.header, body: post.body });
    const [isEditable, setEditable] = useState(false);
    const [isDeleting, setDeleting] = useState(false);
    const { user } = useContext(AuthContext);

    const handleHeaderChange = (e) => {
        setEditedPost({ ...editedPost, header: e.target.value });
    }

    const handleBodyChange = (e) => {
        setEditedPost({ ...editedPost, body: e.target.value });
    }

    const handleEdit = () => {
        if (isEditable) {
            // Send edited post to the server
            fetch(`http://localhost:8000/api/post/${post._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('x-auth-token'),
                },
                body: JSON.stringify(editedPost)
            })
                .then(response => {
                    if (response.ok) {
                        // Update the post header and body in the UI
                        post.header = editedPost.header;
                        post.body = editedPost.body;
                        setEditable(false);
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            setEditable(true);
        }
    }

    const handleDelete = () => {
        setDeleting(true);
        // Send delete request to the server
        fetch(`http://localhost:8000/api/post/${post._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('x-auth-token'),
            }
        })
            .then(response => {
                if (response.ok) {
                    // Remove the post from the UI
                    setDeleting(false);
                    window.location.reload(); // Refresh the page to reflect the changes
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <div className="post-conttainer">
            <div className='autor-and-options'>
                <span className="author-name">{post.fullname}</span>
                <span className="publish-date">{post.creationDate}</span>

                {user && user.email == post.email && <div className="options-container" >
                    <svg className='options-button' role='button' fill="currentColor" viewBox="0 0 20 20" width="1em" height="1em" ><g fillRule="evenodd" transform="translate(-446 -350)"><path d="M458 360a2 2 0 1 1-4 0 2 2 0 0 1 4 0m6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0"></path></g></svg>
                    <div className="options-menu">
                        {(isEditable) ?
                            <>
                                <div className='option' onClick={() => { handleEdit() }}>Save</div>
                                <div className='option' onClick={() => { setEditable(!isEditable) }}>Cancel</div>
                            </>
                            :
                            <>
                                <div className='option' onClick={() => { setEditable(!isEditable) }}>Edit</div>
                                <div className='option' onClick={() => { handleDelete() }}  >Delete</div>
                            </>
                        }
                    </div>
                </div>}
            </div>

            {isEditable ?
                <div className="post-header">
                    <input type="text" value={editedPost.header} onChange={handleHeaderChange} />
                </div>
                :
                <div className="post-header">{post.header}</div>
            }
            {isEditable ?
                <div className="post-body">
                    <textarea value={editedPost.body} onChange={handleBodyChange}></textarea>
                </div>
                :
                <div className="post-body">{post.body}</div>
            }

        </div>
    );
};

export default Post;
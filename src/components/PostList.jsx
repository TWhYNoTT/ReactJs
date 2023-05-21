import React, { useState, useEffect, useRef, useContext } from "react";
import NewPost from './NewPost'
import { AuthContext } from "../context/AuthContext";
import Post from "./Post";

function PostList() {

    const [isRendered, setIsRendered] = useState(false);
    const { isAuthenticated, posts, fetchPosts, hasMore, isLoading } = useContext(AuthContext);
    const [page, setPage] = useState(0);
    const observerTarget = useRef(null);

    useEffect(() => {
        if (hasMore && isRendered) {
            fetchPosts(page);
        }

    }, [page, hasMore, isRendered]);

    useEffect(() => {
        setIsRendered(true)
    }, []);

    // infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {

                if (entry.isIntersecting && hasMore && !isLoading) {
                    setPage((prevPage) => prevPage + 1);
                }
            });
        });
        const target = observerTarget.current;
        if (target) {
            observer.observe(target);
        }

        return () => {
            const target = observerTarget.current;
            if (target) {
                observer.unobserve(target);
            }
        };
    }, [hasMore, page, isLoading]);




    return (
        <>
            {isAuthenticated && <NewPost />}
            {posts.map((post) => (
                <Post key={post._id} post={post} />
            ))}
            <div ref={observerTarget}></div>
            {(isLoading && hasMore) ? <p>Loading...</p> : !hasMore && <p>No more posts.</p>}
        </>

    );
}



export default PostList;
import React, { useState, useEffect, useRef, useContext } from "react";
import NewPost from './NewPost'
import { AuthContext } from "../context/AuthContext";
import Post from "./Post";


function PostList() {
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [posts, setPosts] = useState([]);
    const observerTarget = useRef(null);
    const { isAuthenticated } = useContext(AuthContext);



    useEffect(() => {
        setIsLoading(true);
        const fetchPosts = async () => {
            try {

                const response = await fetch(`http://192.168.1.25:8000/api/post?page=${page}`, {
                    method: "GET",

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
        if (hasMore) {
            fetchPosts();
        }
    }, [page, hasMore]);






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

    useEffect(() => {
        setHasMore(true)
    }, []);

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


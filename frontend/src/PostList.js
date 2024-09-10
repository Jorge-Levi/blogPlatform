import React, { useEffect, useState } from 'react';
import API from './api';

const PostList = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await API.get('/posts');
                setPosts(response.data);
            } catch (error) {
                console.log('Error al obtener las publicaciones');
            }
        };
        fetchPosts();
    }, []);

    return (
        <div>
            <h2>Publicaciones</h2>
            {posts.map((post) => (
                <div key={post._id}>
                    <h3>{post.title}</h3>
                    <p>{post.body}</p>
                    <p><strong>Autor:</strong> {post.author.username}</p>
                </div>
            ))}
        </div>
    );
};

export default PostList;

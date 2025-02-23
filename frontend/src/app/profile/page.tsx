'use client';
import { useEffect, useState } from "react";
import axios from 'axios';

export default function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = "/login";
      return;
    }

    axios.get('http://localhost:8000/profile/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      console.log("Posts data:", response.data); 
      setPosts(response.data);
    })
    .catch(error => console.error(error));
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Your Profile</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center", 
          gap: "20px", 
        }}
      >
        {posts.length === 0 ? (
          <p>No posts yet. Start uploading!</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              style={{
                width: "30%", 
                maxWidth: "350px",
                height: "350px", 
                border: "1px solid black",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                padding: "10px",
              }}
            >
              
              <img
                src={post.image_url}
                alt={post.caption}
                style={{
                  maxWidth: "100%",
                  maxHeight: "85%", 
                  objectFit: "contain",
                }}
              />

              
              <div
                style={{
                  width: "100%",
                  color: "black",
                  textAlign: "center",
                  padding: "5px",
                  fontSize: "14px",
                }}
              >
                <strong>{post.username}</strong> <br />
                {post.caption}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

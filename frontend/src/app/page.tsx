"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import axios from "axios";
import { Card, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    axios
      .get("http://localhost:8000/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Feed data:", response.data);
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching feed:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        }
      });
  }, []);

  return (
    <Container className="d-flex flex-column align-items-center mt-4">
      <h2 className="mb-4">Feed</h2>

      {posts.length === 0 ? (
        <p>No posts to show...</p>
      ) : (
        <Row className="w-100 d-flex flex-column align-items-center">
          {posts.map((post) => (
            <Col key={post.id} xs={12} className="d-flex justify-content-center mb-4">
              <Card className="shadow-sm border-dark" style={{ maxWidth: "500px", width: "100%" }}>
                
                <Card.Header className="d-flex align-items-center bg-dark text-white">
                  {post.profile_picture ? (
                    <img
                      src={`http://localhost:8000/media/${post.profile_picture}`}
                      alt="Profile"
                      className="rounded-circle me-2 border border-light"
                      width="40"
                      height="40"
                    />
                  ) : (
                    <div className="rounded-circle bg-secondary me-2" style={{ width: "40px", height: "40px" }} />
                  )}

                  <strong>{post.username}</strong>
                </Card.Header>

                <Card.Img
                  variant="top"
                  src={post.image_url}
                  alt={post.caption}
                  style={{
                    objectFit: "contain", // Ensures the whole image fits within the container
                    maxHeight: "500px", // Restricts height to avoid overflowing
                    width: "100%", // Makes sure it fits the card width
                  }}
                />

                <Card.Body>
                  <Card.Text>
                    <strong>{post.username}</strong> {post.caption}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

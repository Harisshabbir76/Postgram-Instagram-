"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UserProfile() {
  const router = useRouter();
  const params = useParams();
  const username = params?.username as string;

  const [userData, setUserData] = useState({
    name: "",
    username: "",
    profile_picture: "",
  });

  const [userPosts, setUserPosts] = useState([]); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
  
    const headers = { Authorization: `Bearer ${token}` };

    axios.get(`http://localhost:8000/profile/${username}/`, { headers })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
        if (error.response?.status === 401) {
          router.push("/login");
        }
      });

    axios.get(`http://localhost:8000/profile/${username}/posts/`, { headers })
      .then((response) => {
        setUserPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        if (error.response?.status === 401) {
          router.push("/login");
        }
      });
  }, [username, router]);

  return (
    <Container className="mt-4 text-center">
      <Card className="p-4 shadow">
        <h2>{userData.name ? `${userData.name}'s Profile` : "User Profile"}</h2>
        {userData.profile_picture ? (
          <img
            src={userData.profile_picture}
            alt="Profile"
            className="rounded-circle border"
            width="100"
            height="100"
          />
        ) : (
          <div className="rounded-circle bg-secondary border" style={{ width: "100px", height: "100px" }} />
        )}
        <p><strong>Username:</strong> @{userData.username || "Unknown"}</p>
      </Card>

      <h3 className="mt-4">Posts</h3>
      <Row className="justify-content-center">
        {userPosts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          userPosts.map((post) => (
            <Col key={post.id} xs={12} sm={6} md={4} className="mb-4">
              <Card className="shadow-sm border-dark">
              <Card.Img
                variant="top"
                src={post.image_url} 
                alt={post.caption}
                style={{ 
                  objectFit: "contain",  // Ensures the full image fits inside
                  height: "300px", 
                  width: "100%", 
                  borderRadius: "5px" // Optional: Slightly round edges
                }}
              />
                <Card.Body>
                  <Card.Text>{post.caption}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}

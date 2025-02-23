"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Container, Card, Form, Button } from "react-bootstrap";
import { FaPencilAlt } from "react-icons/fa";
import CustomAlert from "../../../components/Alert"; 

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState({ name: "", username: "", email: "" });
  const [isEditing, setIsEditing] = useState({ name: false, username: false, email: false });

  
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    axios
      .get("http://localhost:8000/profile/profile-info/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching profile info:", error.response?.status, error.response?.data);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        }
      });
  }, []);

  const handleEditClick = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        "http://localhost:8000/profile/edit-profile/",
        {
          name: userData.name,
          username: userData.username,
          email: userData.email,
        },
        {
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json", 
          },
        }
      );

      
      setAlertMessage("Profile updated successfully!");
      setAlertVariant("success");
      setIsEditing({ name: false, username: false, email: false }); 
    } catch (error) {
      console.error("Error updating profile:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      }
      setAlertMessage("Failed to update profile. Please try again.");
      setAlertVariant("danger");
    }
  };

  return (
    <Container className="mt-4">
      
      <CustomAlert 
        message={alertMessage} 
        variant={alertVariant} 
        onClose={() => setAlertMessage("")} 
      />

      <Card className="p-4 shadow text-center">
        <h2>Profile Info</h2>

        
        <div className="d-flex justify-content-between align-items-center w-50 mx-auto mt-3">
          <strong>Name:</strong>
          {isEditing.name ? (
            <Form.Control
              type="text"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            />
          ) : (
            <span>{userData.name}</span>
          )}
          <FaPencilAlt
            className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => handleEditClick("name")}
          />
        </div>

        
        <div className="d-flex justify-content-between align-items-center w-50 mx-auto mt-2">
          <strong>Username:</strong>
          {isEditing.username ? (
            <Form.Control
              type="text"
              value={userData.username}
              onChange={(e) => setUserData({ ...userData, username: e.target.value })}
            />
          ) : (
            <span>{userData.username}</span>
          )}
          <FaPencilAlt
            className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => handleEditClick("username")}
          />
        </div>

        
        <div className="d-flex justify-content-between align-items-center w-50 mx-auto mt-2">
          <strong>Email:</strong>
          {isEditing.email ? (
            <Form.Control
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            />
          ) : (
            <span>{userData.email}</span>
          )}
          <FaPencilAlt
            className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => handleEditClick("email")}
          />
        </div>

        
        {(isEditing.name || isEditing.username || isEditing.email) && (
          <Button variant="success" className="mt-3" onClick={handleSave}>
            Save Changes
          </Button>
        )}
      </Card>
    </Container>
  );
}

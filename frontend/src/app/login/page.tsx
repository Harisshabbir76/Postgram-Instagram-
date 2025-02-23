"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Form, Button, Container, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomAlert from "../../components/Alert";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState<"success" | "danger" | "warning" | "info">("info");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:8000/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => router.push("/profile"))
        .catch(() => localStorage.removeItem("token"));
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/login/", {
        username,
        password,
      });

      if (response.data.access && response.data.refresh) {
        localStorage.setItem("token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        setAlertMessage("Login successful! Redirecting...");
        setAlertVariant("success");

        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setAlertMessage("Something went wrong!");
        setAlertVariant("danger");
      }
    } catch (error) {
      setAlertMessage("Invalid username or password");
      setAlertVariant("danger");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh", marginTop: "-30px" }}>
      <Card className="p-4 shadow" style={{ width: "400px" }}>
        <h2 className="text-center mb-3">Login</h2>

        
        <CustomAlert message={alertMessage} variant={alertVariant} onClose={() => setAlertMessage("")} />

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>

          <Button variant="primary" className="w-100" onClick={handleLogin}>
            Login
          </Button>
        </Form>
        <p style={{marginLeft:"50px", marginTop:"20px" }}>Forgot Password? <a href="login/forget-password" >Reset Password</a></p>
        <p style={{marginLeft:"50px", marginTop:"20px" }}>don't have account <a href="/register">register</a></p>
      
      </Card>
    </Container>
  );
}

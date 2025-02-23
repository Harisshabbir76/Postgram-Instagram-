"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Form, Button, Container, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomAlert from "../../components/Alert";

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pfp, setPfp] = useState<File | null>(null);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState<"success" | "danger">("info");
  const router = useRouter();

  const sendOtp = async () => {
    try {
      await axios.post("http://localhost:8000/register/", { name, email, username, password });
      setAlertMessage("OTP sent to your email.");
      setAlertVariant("info");
      setOtpSent(true);
    } catch (error) {
      setAlertMessage(error.response?.data?.error || "Failed to send OTP.");
      setAlertVariant("danger");
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post("http://localhost:8000/verify-otp/", { email, otp, password, username, name });
      setAlertMessage("User registered successfully! Please log in.");
      setAlertVariant("success");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setAlertMessage(error.response?.data?.error || "OTP verification failed.");
      setAlertVariant("danger");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh", marginTop: "20px" }}>
      <Card className="p-4 shadow" style={{ width: "400px" }}>
        <h2 className="text-center mb-3">Register</h2>
        <CustomAlert message={alertMessage} variant={alertVariant} onClose={() => setAlertMessage("")} />

        {!otpSent ? (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control required type="text" placeholder="Enter your full name" onChange={(e) => setName(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control required type="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control required type="text" placeholder="Choose a username" onChange={(e) => setUsername(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control required type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>

            <Button variant="success" className="w-100" onClick={sendOtp}>
              Send OTP
            </Button>
          </Form>
        ) : (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Enter OTP</Form.Label>
              <Form.Control required type="text" placeholder="Enter OTP sent to your email" onChange={(e) => setOtp(e.target.value)} />
            </Form.Group>

            <Button variant="primary" className="w-100" onClick={verifyOtp}>
              Verify OTP & Register
            </Button>
          </Form>
        )}

        <p style={{ marginLeft: "50px", marginTop: "20px" }}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </Card>
    </Container>
  );
}

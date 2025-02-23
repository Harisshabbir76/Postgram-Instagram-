"use client";
import { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [message, setMessage] = useState({ text: "", variant: "" });

  // Handle email verification
  const handleEmailSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:8000/login/forget-password", { email });
      setMessage({ text: response.data.message, variant: "success" });
      setEmailVerified(true); // Enable password input
    } catch (error) {
      setMessage({ text: error.response?.data.error || "Email not found!", variant: "danger" });
    }
  };

  // Handle password reset
  const handlePasswordReset = async () => {
    try {
      await axios.put("http://localhost:8000/login/forget-password", { email, password: newPassword });
      setMessage({ text: "Password updated successfully!", variant: "success" });
      setEmailVerified(false);
      setNewPassword(""); // Clear input after success
    } catch (error) {
      setMessage({ text: error.response?.data.error || "Failed to update password.", variant: "danger" });
    }
  };

  return (
    <Container className="mt-4">
      <h2>Forgot Password</h2>
      {message.text && <Alert variant={message.variant}>{message.text}</Alert>}

      {/* Email Input for Verification */}
      {!emailVerified ? (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>
          <Button onClick={handleEmailSubmit} variant="primary">Verify Email</Button>
        </>
      ) : (
        <>
          {/* Password Input for Reset */}
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </Form.Group>
          <Button onClick={handlePasswordReset} variant="success">Reset Password</Button>
        </>
      )}
    </Container>
  );
}

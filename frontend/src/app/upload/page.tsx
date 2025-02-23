"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Form, Button, Container, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UploadPost() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!image) {
      setError("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);

    const token = localStorage.getItem("token");

    try {
      await axios.post("http://localhost:8000/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.reload();
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      setError(
        "Failed to upload post: " +
          (error.response?.data?.detail || "Check console for details")
      );
    }
  };

  return isAuthenticated ? (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
      <Card className="p-4 shadow-lg" style={{ width: "400px" }}>
        <h2 className="text-center mb-3">Upload a New Post</h2>

        {error && <p className="text-danger text-center">{error}</p>}

        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Image Upload */}
          <Form.Group className="mb-3 text-center">
            <Form.Label className="d-block">
              <strong>Select Image</strong>
            </Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </Form.Group>

          
          <Form.Group className="mb-3">
            <Form.Label>Caption</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter a caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
            />
          </Form.Group>
          
          
          <Button variant="success" type="submit" className="w-100">
            Upload
          </Button>
        </Form>
      </Card>
    </Container>
  ) : null;
}

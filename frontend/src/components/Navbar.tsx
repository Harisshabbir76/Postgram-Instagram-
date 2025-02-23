"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar, Container, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from "../components/dropdown";
import CustomAlert from "../components/Alert"; 
import Search from "../components/Search";  // ✅ Import Search Component

export default function NavScrollExample() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); 
  const [alertVariant, setAlertVariant] = useState("success"); 

  useEffect(() => {
    setHydrated(true);
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");  // 🔴 Remove token from localStorage
    setIsAuthenticated(false);  // 🔴 Update state
    setAlertMessage("You have been logged out successfully.");  // ✅ Show alert
    setAlertVariant("success");
    
    setTimeout(() => {
      router.push("/login");  // ✅ Redirect to login page
    }, 1500);
  };

  if (!hydrated) {
    return null;
  }

  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/">
          <h1>Postgram</h1>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">

          <div className="position-fixed bottom-0 start-50 translate-middle-x mb-3">
            <CustomAlert
              message={alertMessage}
              variant={alertVariant}
              onClose={() => setAlertMessage("")}
            />
          </div>

          {isAuthenticated ? (
            <div className="d-flex w-100 justify-content-between align-items-center">
              
              {/* ✅ Search Component */}
              <Search />

              {/* ✅ Pass handleLogout to Dropdown */}
              <Dropdown handleLogout={handleLogout} />
            </div>
          ) : (
            <div className="ms-auto d-flex gap-2">
              <Button variant="success" href="/login">
                Login
              </Button>
              <Button variant="success" href="/register">
                Register
              </Button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

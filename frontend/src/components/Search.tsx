"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Form, Dropdown } from "react-bootstrap";

export default function Search() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");  
  const [searchResults, setSearchResults] = useState([]);  

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);  
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`http://localhost:8000/search/?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleProfileClick = (username: string) => {
    router.push(`/profile/${username}/`);  // ✅ Redirect to that user's profile page
    setSearchQuery("");  
    setSearchResults([]);  
  };

  return (
    <div className="position-relative w-50">
      <Form.Control
        type="text"
        placeholder="Search users..."
        className="w-100"
        value={searchQuery}
        onChange={handleSearch}
      />

      {/* DROPDOWN SEARCH RESULTS */}
      {searchResults.length > 0 && (
        <Dropdown.Menu show className="w-100 position-absolute">
          {searchResults.map((user) => (
            <Dropdown.Item key={user.id} onClick={() => handleProfileClick(user.username)}>
              <strong>{user.name}</strong> (@{user.username})
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      )}
    </div>
  );
}

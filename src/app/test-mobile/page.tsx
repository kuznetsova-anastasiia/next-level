"use client";

import { useState } from "react";

export default function TestMobile() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#1a1a1a",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <h1>Mobile Menu Test</h1>

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "10px 20px",
          backgroundColor: "#ff4fd8",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Toggle Menu: {isOpen ? "Open" : "Closed"}
      </button>

      <div
        style={{
          display: isOpen ? "block" : "none",
          backgroundColor: "#333",
          padding: "20px",
          borderRadius: "8px",
          border: "2px solid #ff4fd8",
        }}
      >
        <p>Mobile menu content</p>
        <ul>
          <li>Link 1</li>
          <li>Link 2</li>
          <li>Link 3</li>
        </ul>
      </div>

      <div style={{ marginTop: "20px" }}>
        <p>State: {isOpen ? "Open" : "Closed"}</p>
        <p>This is a test to verify the mobile menu functionality works.</p>
      </div>
    </div>
  );
}

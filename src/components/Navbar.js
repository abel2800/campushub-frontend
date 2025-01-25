import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{ padding: "10px", backgroundColor: "#001529", color: "#fff" }}>
      <ul style={{ display: "flex", listStyle: "none", justifyContent: "space-around" }}>
        <li><Link to="/home" style={{ color: "white" }}>Home</Link></li>
        <li><Link to="/courses" style={{ color: "white" }}>Courses</Link></li>
        <li><Link to="/social-media" style={{ color: "white" }}>Social Media</Link></li>
        <li><Link to="/chat" style={{ color: "white" }}>Chat</Link></li>
        <li><Link to="/grades" style={{ color: "white" }}>Grades</Link></li>
        <li><Link to="/exams" style={{ color: "white" }}>Exams</Link></li>
        <li><Link to="/my-learning" style={{ color: "white" }}>My Learning</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;

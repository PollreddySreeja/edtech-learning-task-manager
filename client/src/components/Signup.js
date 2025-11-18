import React, { useState } from "react";
import axios from "axios";

function Signup({ onSignupSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [teacherId, setTeacherId] = useState("");
  const [msg, setMsg] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/signup", {
        email,
        password,
        role,
        teacherId: role === "student" ? teacherId : null,
      });

      setMsg("User registered successfully!");
      onSignupSuccess();
    } catch (err) {
      setMsg("Signup failed!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /> <br/><br/>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /> <br/><br/>

        <label>Select Role: </label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        <br/><br/>

        {role === "student" && (
          <>
            <input
              type="text"
              placeholder="Teacher ID"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              required
            />
            <br/><br/>
          </>
        )}

        <button type="submit">Signup</button>
      </form>

      <p>{msg}</p>
    </div>
  );
}

export default Signup;

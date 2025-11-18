import "./App.css";
import React, { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";

function App() {
  const [page, setPage] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setPage("login");
  };

  if (isLoggedIn) {
  const user = JSON.parse(localStorage.getItem("user"));

  return user.role === "teacher"
    ? <TeacherDashboard onLogout={handleLogout} />
    : <StudentDashboard onLogout={handleLogout} />;
}


  if (page === "login") {
    return <Login onLoginSuccess={handleLoginSuccess} onSignup={() => setPage("signup")} />;
  }

  if (page === "signup") {
    return <Signup onSignupSuccess={() => setPage("login")} />;
  }

  return null;
}

export default App;

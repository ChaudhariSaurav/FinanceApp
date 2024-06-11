import React, { useState } from "react";
import { Input, Button, message } from "antd";
import { Link } from "react-router-dom";

const AdminLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Here you can perform authentication logic, like sending a request to a server
    // For simplicity, let's just check if the username and password match a hardcoded value
    if (username === "admin" && password === "password") {
      // Authentication successful, you can redirect to the admin dashboard or perform any other action
      message.success("Login Successful!");
    } else {
      // Authentication failed
      message.error("Invalid username or password.");
    }
  };

  return (
    <div className="container mx-auto mt-20 flex justify-center">
      <div className="w-96">
        <h1 className="text-center text-2xl font-bold mb-4">Admin Login</h1>
        <Input
          placeholder="Username"
          className="mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input.Password
          placeholder="Password"
          className="mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="primary" block onClick={handleLogin}>
          Login
        </Button>

        <p className="mt-2 text-sm text-center text-gray-600">
          Don't have an account yet?{" "}
          <Link to="/auth/login" className="text-indigo-600 hover:underline">
            Login now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;

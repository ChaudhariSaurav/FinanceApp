import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  GoogleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import axios from "axios";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [customerId, setCustomerId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "customerId") {
      setCustomerId(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onFinish = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://financeappbackend-zlsu.onrender.com/api/user/login",
        { customerId, password },
      );

      if (response.data.status === "failed") {
        let errorMessage = "Internal Server Error";
        if (response.data.message) {
          errorMessage = response.data.message;
        }
        notification.error({
          message: "Login Failed",
          description: errorMessage,
        });
      } else {
        console.log("Login successful:", response.data);
        const token = response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("Customer Id", customerId);
        notification.success({
          message: "Login Success!",
          description: response.data?.message,
          style: {
            backgroundColor: "#f6ffed", // Green background
            border: "1px solid #b7eb8f", // Green border
            color: "#52c41a", // Green text
          },
        });
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Login failed:", error);
      let errorMessage = "Internal Server Error";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      notification.error({
        message: "Login Failed",
        description: errorMessage,
      });
    }
    setLoading(false);
  };

  const adminLogin = () => {
    window.location.href = "/admin/login";
  };

  return (
    <div className="h-screen bg-gray-100">
      <div className="flex justify-center items-center">
        <img
          src="https://ik.imagekit.io/laxmifinance/adfinancelogo.png?updatedAt=1717456339448"
          alt="AD FINANCE"
          className="h-10 w-auto mb-8"
          style={{ height: "100px", marginTop: "50px" }}
        />
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
          <h1 className="text-center text-2xl mb-6">Sign in to your account</h1>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="customerId"
              rules={[{ required: true, message: "Please enter Customer ID!" }]}
              className="mb-8"
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Enter Customer ID"
                size="large"
                name="customerId"
                value={customerId}
                onChange={handleInputChange}
                className="w-full"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your Password!" },
              ]}
              className="mb-6"
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Enter Password"
                size="large"
                name="password"
                value={password}
                onChange={handleInputChange}
                className="w-full"
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone onClick={togglePasswordVisibility} />
                  ) : (
                    <EyeInvisibleOutlined onClick={togglePasswordVisibility} />
                  )
                }
              />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-between">
                <Link
                  to={"/forgot-password"}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Forgot your password ?
                </Link>
                <Link
                  to={"/forgot-CustomerId"}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Forgot Customer Id ?
                </Link>
              </div>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white"
              >
                Log in
              </Button>
            </Form.Item>

            <div className="flex mt-7 items-center text-center">
              <hr className="border-gray-300 border-1 w-full rounded-md" />
              <label className="block font-medium text-sm text-gray-600 w-full">
                Access with
              </label>
              <hr className="border-gray-300 border-1 w-full rounded-md" />
            </div>

            <div className="flex justify-center mt-6">
              <Button type="default" block size="large" className="w-full">
                <GoogleOutlined /> Log in with Google
              </Button>
              <Button
                onClick={adminLogin}
                type="default"
                block
                size="large"
                className="w-full ml-2"
              >
                Admin Login
              </Button>
            </div>

            <p className="mt-6 text-sm text-center text-gray-600">
              By signing in you accept the{" "}
              <a href="#" className="text-indigo-600 hover:underline">
                Terms of Use
              </a>{" "}
              and acknowledge the{" "}
              <a href="#" className="text-indigo-600 hover:underline">
                Privacy Statement
              </a>
              .
            </p>
            <p className="mt-2 text-sm text-center text-gray-600">
              Don't have an account yet?{" "}
              <Link
                to="/auth/register"
                className="text-indigo-600 hover:underline"
              >
                Register now
              </Link>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

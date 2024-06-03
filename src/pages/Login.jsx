import React, { useState } from "react";
import { Form, Input, Button, Modal, notification } from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [customerId, setCustomerId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleForgotPassword = () => {
    setForgotPasswordVisible(true); // Open the forgot password modal
  };

  const handleForgotPasswordCancel = () => {
    setForgotPasswordVisible(false); // Close the forgot password modal
  };

  const onFinish = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://e8d764d4-7deb-4a05-afb4-ebe6f8683979-00-2m4thjlwbmxjg.sisko.replit.dev/api/user/login",
        { customerId, password },
      );

      if (response.data.status === "failed") {
        let errorMessage = "An unexpected error occurred.";
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
        localStorage.setItem("customerId", customerId);
        notification.success({
          message: "Login Success!",
          description: response.data?.message,
          style: {
            backgroundColor: "#f6ffed", // Green background
            border: "1px solid #b7eb8f", // Green border
            color: "#52c41a", // Green text
          },
        });
        navigate("/dashboard");
        // Redirect to dashboard or desired page after successful login
      }
    } catch (error) {
      console.error("Login failed:", error);
      let errorMessage = "An unexpected error occurred.";
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

  const handleForgotPasswordSubmit = async (values) => {
    const { mobileNumber, email } = values;
    try {
      setLoading(true);
      const response = await axios.post(
        "https://e8d764d4-7deb-4a05-afb4-ebe6f8683979-00-2m4thjlwbmxjg.sisko.replit.dev/api/user/get_customer",
        {
          mobileNumber,
          email,
        },
      );
      setLoading(false);
      if (response.data.customerId) {
        notification.error({
          message: response.data,
          description: response.data.message,
        });
        setVisible(false); // Close the modal after successful submission
      } else {
        notification.success({
          message: "Success",
          description: response.data.message,
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("Forgot Password Error:", error);
      notification.error({
        message: "Forgot Password Failed",
        description: "An unexpected error occurred. Please try again later.",
      });
    }
  };
  return (
    <div className="flex justify-center items-center h-fit bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
        <h1 className="text-center text-2xl mb-6">Sign in to JR Group's</h1>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="customerId"
            rules={[{ required: true, message: "Please enter Customer ID!" }]}
            className="mb-6"
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Customer ID"
              size="large"
              name="customerId"
              value={customerId}
              onChange={handleInputChange}
              className="w-full"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your Password!" }]}
            className="mb-6"
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
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
            <a
              className="text-blue-500 hover:text-blue-700"
              onClick={handleForgotPassword}
            >
              Forgot password
            </a>
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
          <div className="flex justify-center mt-6">
            <Button type="default" block size="large" className="w-full">
              Log in with Google
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

        {/* Forgot Password Modal */}
        <Modal
          title="Forgot Password"
          visible={forgotPasswordVisible}
          onCancel={handleForgotPasswordCancel}
          footer={null}
        >
          <Form
            name="forgot_password_form"
            initialValues={{ remember: true }}
            onFinish={handleForgotPasswordSubmit}
          >
            <Form.Item
              name="mobileNumber"
              rules={[
                { required: true, message: "Please enter your mobile number!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Mobile Number"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Invalid email format!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default LoginForm;

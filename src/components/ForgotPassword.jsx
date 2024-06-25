import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios for making HTTP requests

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    const { email, password, password_confirmation } = values;
    try {
      const response = await axios.post(
        "https://financeappbackend-zlsu.onrender.com/api/user/reset",
        { email, password, password_confirmation },
      );

      if (response.data.status === "success") {
        notification.success({
          message: "Password Reset Successful",
          description: "Your password has been reset successfully.",
        });
        form.resetFields(); // Clear the form fields
      } else {
        notification.error({
          message: "Password Reset Failed",
          description: response.data.message || "Internal Server Error.",
        });
      }
    } catch (error) {
      console.error("Password Reset Error:", error);
      notification.error({
        message: "Password Reset Failed",
        description: "Internal Server Error. Please try again later.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
        <h1 className="text-center text-2xl mb-6">Reset your password</h1>
        <small>
          Enter the email address associated with your account, and your new
          password, to reset your password.
        </small>
        <Form
          form={form} // Attach the form instance
          name="forgot_password_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          className="mb-6"
        >
          <Form.Item
            name="email"
            rules={[
              {
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                type: "email",
                message: "The input is not a valid email!",
              },
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
            className="mt-6"
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              {
                pattern:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
                message:
                  "Password must be at least 8 characters long and contain at least one alphabet, one number, and one special character.",
              },
            ]}
            className="mt-4"
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password_confirmation"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!",
                    ),
                  );
                },
              }),
            ]}
            className="mt-4"
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Confirm Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              className="mt-4"
            >
              Reset Password
            </Button>
          </Form.Item>
          <p className="mt-2 text-sm text-center text-gray-600">
            Have you already?{" "}
            <Link to="/auth/login" className="text-indigo-600 hover:underline">
              Can't reset your password?
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;

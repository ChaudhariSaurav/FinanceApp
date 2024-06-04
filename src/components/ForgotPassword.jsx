import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    // Implement your forgot password logic here
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Show success notification
      notification.success({
        message: "Password Reset Email Sent",
        description: "Please check your email to reset your password.",
      });
    } catch (error) {
      console.error("Forgot Password Error:", error);
      // Show error notification
      notification.error({
        message: "Forgot Password Failed",
        description: "An unexpected error occurred. Please try again later.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
        <h1 className="text-center text-2xl mb-6">Reset your password</h1>
        <small>
          Enter the email address associated with your account and we'll send
          you a link to reset your password.
        </small>
        <Form
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
            className="mt-6 "
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
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
              Continue
            </Button>
          </Form.Item>
          <p className="mt-2 text-sm text-center text-gray-600">
            Have you alrea?{" "}
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

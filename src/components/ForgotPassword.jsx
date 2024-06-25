import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios for making HTTP requests

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // Initialize the form instance

  const onFinish = async (values) => {
    setLoading(true);
    const { email } = values; // Destructure email from form values
    try {
      // Make POST request to the reset password API endpoint
      const response = await axios.post(
        "https://financeappbackend-zlsu.onrender.com/api/user/send-reset-password-email",
        { email },
      );

      if (response.data.status === "success") {
        // Show success notification if email was sent successfully
        notification.success({
          message: "Password Reset Email Sent",
          description: "Please check your email to reset your password.",
        });
        form.resetFields(); // Clear the email input field
      } else {
        // Show error notification if there was an issue sending the email
        notification.error({
          message: "Password Reset Failed",
          description: response.data.message || "Internal Server Error.",
        });
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      // Show error notification if there was a network error or other unexpected error
      notification.error({
        message: "Forgot Password Failed",
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
          Enter the email address associated with your account and we'll send
          you a link to reset your password.
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

import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { LockOutlined } from "@ant-design/icons";
import axios from "axios"; // Import axios for making HTTP requests

const ResetPasswordForm = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    const { password } = values;

    try {
      // Make POST request to update the password
      const response = await axios.post(
        `https://financeappbackend-zlsu.onrender.com  /api/user/reset/:userId/:token`,
        { password },
      );

      if (response.data.status === "success") {
        notification.success({
          message: "Password Updated Successfully",
          description: "You can now log in with your new password.",
        });
      } else {
        notification.error({
          message: "Password Update Failed",
          description: response.data.message || "Internal Server Error.",
        });
      }
    } catch (error) {
      console.error("Reset Password Error:", error);
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
        <h1 className="text-center text-2xl mb-6">Reset Your Password</h1>
        <Form name="reset_password_form" onFinish={onFinish} className="mb-6">
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your new password!",
              },
              {
                min: 8,
                message: "Password must be at least 8 characters long!",
              },
            ]}
            className="mt-6"
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="New Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
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
                    new Error("The two passwords do not match!"),
                  );
                },
              }),
            ]}
            className="mt-4"
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Confirm New Password"
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
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;

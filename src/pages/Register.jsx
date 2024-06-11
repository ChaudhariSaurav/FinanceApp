import React, { useState } from "react";
import { Form, Input, Button, Checkbox, notification, Select } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";

const { Option } = Select;

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [role, setRole] = useState("user"); // Default role is "user"

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    const { terms, ...rest } = values;
    const data = { ...rest, tc: true, role }; // Include 'role' in the data sent to backend

    try {
      const response = await axios.post(
        "https://financeappbackend-zlsu.onrender.com/api/user/register",
        data,
      );

      if (response.data.status === "failed") {
        notification.error({
          message: "Registration Failed",
          description: response.data.message || "Something went wrong.",
        });
      } else {
        form.resetFields();
        setCustomerId(response.data.customerId);
        setName(response.data.name);
        setEmail(response.data.email);
        setMobileNumber(response.data.mobileNumber);
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      notification.error({
        message: "Registration Failed",
        description: response.data.message || "Something went wrong.",
      });
    }
    setLoading(false);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleCopyCustomerId = () => {
    navigator.clipboard.writeText(customerId);
    const notificationKey = notification.success({
      message: "Copied",
      description: `${customerId} copied to clipboard.`,
    });

    setTimeout(() => {
      notification.close(notificationKey);
    }, 3000);
  };

  return (
    <div className="flex justify-center border-2 border-black items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
        <h1 className="text-center text-2xl mb-4">Sign up into JR GROUP'S</h1>
        <span className="text-left mb-6 block">
          Please fill in the form to get started with your account.
        </span>
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          scrollToFirstError
          initialValues={{ tc: false }}
          className="w-full max-w-md"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Name"
              size="large"
            />
          </Form.Item>

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
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="mobileNumber"
            rules={[
              {
                required: true,
                message: "Please input your mobile number!",
              },
              {
                pattern: /^\d{10}$/,
                message: "Mobile number must be 10 digits long.",
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined className="site-form-item-icon" />}
              placeholder="Mobile Number"
              size="large"
              maxLength={10}
            />
          </Form.Item>

          <Form.Item
            name="role"
            initialValue="user"
            rules={[
              {
                required: true,
                message: "Please select your role!",
              },
            ]}
          >
            <Select placeholder="Select your role" onChange={setRole}>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
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
            hasFeedback
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
                    new Error("The two passwords do not match!"),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Confirm Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="tc"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Should accept terms and conditions"),
                      ),
              },
            ]}
          >
            <Checkbox>
              I have read the <a href="">terms and conditions</a>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="register-form-button"
              loading={loading}
              block
              size="large"
            >
              Register
            </Button>
          </Form.Item>
        </Form>

        <p class="mt-2 text-sm text-center text-gray-600">
          Already have an account ?{" "}
          <Link
            to={"/auth/login"}
            class="text-indigo-600 hover:underline"
            href="/auth/register"
          >
            Login now
          </Link>
        </p>
        <Modal
          title="Registration Successful"
          visible={modalVisible}
          onCancel={handleModalClose}
          footer={[
            <Button key="copy" onClick={handleCopyCustomerId}>
              Copy Customer ID
            </Button>,
            <Button key="close" type="primary" onClick={handleModalClose}>
              Close
            </Button>,
          ]}
        >
          <div>
            <p className="font-bold">Customer ID: {customerId}</p>
            <p>Name: {name}</p>
            <p>Email: {email}</p>
            <p>Mobile: {mobileNumber}</p>
          </div>
          <div>
            <h3>Guided Login:</h3>
            <ol>
              <li>
                <strong>Step 1:</strong> Copy the Customer ID: Click on the
                "Copy Customer ID" button in the modal window.
              </li>
              <li>
                <strong>Step 2:</strong> Click on the Login Button: Navigate to
                the login page or screen where you can input your credentials.
              </li>
              <li>
                <strong>Step 3:</strong> Enter the Valid Customer ID: In the
                designated field, paste the copied Customer ID.
              </li>
              <li>
                <strong>Step 4:</strong> Enter the Password: Input your password
                in the respective field.
              </li>
              <li>
                <strong>Step 5:</strong> Navigate to Dashboard: After entering
                the correct password, proceed by clicking on the login or submit
                button. Once authenticated, you will be redirected to the
                dashboard, where you can access your account information and
                features.
              </li>
            </ol>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default RegisterForm;

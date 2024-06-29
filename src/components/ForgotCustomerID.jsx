import React, { useState } from "react";
import { Form, Input, Button, notification, Alert } from "antd";
import { PhoneOutlined, MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";

const ForgotCustomerIdForm = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [AlertMsg, setAlertMsg] = useState("");

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { mobileNumber, email } = values;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await axios.post(
        "https://financeappbackend-zlsu.onrender.com/api/user/get_customer",
        {
          mobileNumber,
          email,
        },
      );
      if (response.data.customerId) {
        setAlertMsg(`Your Customer ID is: ${response.data.customerId}`);
        setVisible(true);
        form.resetFields();
      } else {
        setAlertMsg("Customer ID not found.");
        setVisible(true);
        notification.error({
          message: "Forgot Customer ID",
          description: "Customer ID not found.",
        });
      }
    } catch (error) {
      console.error("Forgot Customer ID Error:", error);
      setAlertMsg("You have entered wrong details!");
      setVisible(true);
      notification.error({
        message: "Forgot Customer ID",
        description: "You have entered wrong details! ",
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
        <h1 className="text-center text-2xl mb-6">Forgot Customer ID</h1>
        <span class="text-left mb-6 block bg-[#fff2f0] border border-[#ffccc7] p-2 rounded-md text-center">
          Free to feel here retrieve your Customer ID.
        </span>
        <Form
          form={form}
          name="forgot_customer_id_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
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
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              className="mt-4"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
        {visible && <Alert message={AlertMsg} type="error" showIcon />}
        <p className="mt-2 text-sm text-center text-gray-600">
          Have you already?{" "}
          <Link to="/auth/login" className="text-indigo-600 hover:underline">
            Your have Customer ID?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotCustomerIdForm;

import React, { useState } from "react";
import { Modal, Input, Button, Form, message } from "antd";
import "antd/dist/antd.css";
import "tailwindcss/tailwind.css";

const ForgotPasswordModal = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // Here you would perform your logic to fetch customer ID from the database
        // using the provided mobile number and email
        // For this example, let's just display a message
        message.success("Customer ID sent to your email");
        setVisible(false);
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div>
      <Button type="link" onClick={() => setVisible(true)}>
        Forgot Password?
      </Button>
      <Modal
        title="Forgot Password"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form form={form}>
          <Form.Item
            name="mobileNumber"
            rules={[
              {
                required: true,
                message: "Please enter your mobile number!",
              },
            ]}
          >
            <Input placeholder="Enter Mobile Number" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter your email!",
              },
              {
                type: "email",
                message: "Invalid email format!",
              },
            ]}
          >
            <Input placeholder="Enter Email" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ForgotPasswordModal;

import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Button,
  notification,
  DatePicker,
} from "antd";
import axios from "axios";
import { useLocation } from "react-router-dom";

const TransactionPage = () => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(null); // Changed initial date to null
  const [form] = Form.useForm();

  const location = useLocation();
  const { customerId } = location.state || {};
  const storedCustomerId = localStorage.getItem("customerId");

  const handleAddAmount = () => {
    form.validateFields().then(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found in local storage");
        notification.error({
          message: "Error",
          description: "Authentication token not found. Please login again.",
        });
        return;
      }

      axios
        .post(
          "https://e8d764d4-7deb-4a05-afb4-ebe6f8683979-00-2m4thjlwbmxjg.sisko.replit.dev/api/user/add-amount",
          {
            customerId,
            amount,
            description,
            date: date ? date.format("YYYY-MM-DD") : null,
          }, // Formatting date properly
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .then((response) => {
          console.log(response.data);
          notification.success({
            message: "Amount Added",
            description: "The amount was added successfully.",
          });
          setAmount("");
          setDescription("");
          setDate(null); // Reset date to null
          form.resetFields();
        })
        .catch((error) => {
          console.error("Error adding amount:", error);
          notification.error({
            message: "Error",
            description: "Failed to add amount. Please try again later.",
          });
        });
    });
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-xl font-semibold mb-6">Add Transaction</h1>
      <Row gutter={16} className="mt-6">
        <Col span={24}>
          <Card title="Add Amount">
            <Form form={form} layout="vertical">
              <Form.Item label="Customer ID" name="customerId">
                <Input
                  disabled
                  defaultValue={storedCustomerId}
                  placeholder="Enter customer ID"
                />
              </Form.Item>
              <Form.Item
                label="Amount"
                name="amount"
                rules={[{ required: true, message: "Please enter the amount" }]}
              >
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: "Please enter the description" },
                ]}
              >
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                />
              </Form.Item>
              <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: "Please select the date" }]}
              >
                <DatePicker
                  value={date}
                  onChange={(value) => setDate(value)}
                  placeholder="Select date"
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={handleAddAmount}>
                  Add Amount
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TransactionPage;

import React, { useState } from "react";
import { Card, Col, Row, Statistic, Button, Alert } from "antd";
import axios from "axios";

const AllInfo = () => {
  const [totalUsers, setTotalUsers] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTotalUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://financeappbackend-zlsu.onrender.com/api/user/total-user",
      );
      setTotalUsers(response.data.totalUsers);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch total users:", error);
      setError("Failed to fetch total users. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="site-card-wrapper mt-5 p-5 border border-orangered-500">
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Total Users" bordered={false}>
            {loading ? (
              <Statistic title="Loading..." value="--" />
            ) : error ? (
              <>
                <Statistic title="Error" value="--" />
                <Alert message={error} type="error" showIcon />
              </>
            ) : (
              <Statistic value={totalUsers} />
            )}
            <Button
              type="primary"
              onClick={fetchTotalUsers}
              style={{ marginTop: 16 }}
              loading={loading}
            >
              Fetch Total Users
            </Button>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Transaction History" bordered={false}>
            <p>Transaction history data goes here</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AllInfo;

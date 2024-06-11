import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "antd";

const DashboardHome = () => {
  const [transactionHistory, setTransactionHistory] = useState([]);
  useEffect(() => {
    const storedTransactionHistory = localStorage.getItem("transactionHistory");

    if (storedTransactionHistory) {
      setTransactionHistory(JSON.parse(storedTransactionHistory));
      console.log(transactionHistory);
    } else {
      fetch(
        "https://financeappbackend-zlsu.onrender.com//api/user/add-amount",
      )
        .then((response) => response.json())
        .then((data) => {
          setTransactionHistory(data);
          localStorage.setItem("transactionHistory", JSON.stringify(data));
        })
        .catch((error) =>
          console.error("Error fetching transaction history:", error),
        );
    }
  }, []);
  return (
    <div
      className="container mx-auto"
      style={{ height: "calc(100vh - 64px)", overflow: "auto" }}
    >
      <h1 className="text-3xl font-semibold mb-6">Dashboard Home</h1>

      {/* Overview Section */}
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Total Account Balance">Placeholder Balance</Card>
        </Col>
        <Col span={8}>
          <Card title="Recent Transactions">Placeholder Transactions</Card>
        </Col>
        <Col span={8}>
          <Card title="Quick Links">Placeholder Links</Card>
        </Col>
      </Row>

      {/* Account Summary */}
      <Row gutter={16} className="mt-6">
        <Col span={24}>
          <Card title="Transaction History">
            <ul>
              {transactionHistory.map((transaction) => (
                <li key={transaction.id}>
                  {transaction.date} - {transaction.description} - $
                  {transaction.amount}
                </li>
              ))}
            </ul>
          </Card>
        </Col>
      </Row>

      {/* Budgeting Tools */}
      <Row gutter={16} className="mt-6">
        <Col span={24}>
          <Card title="Budgeting Tools">Placeholder Budgeting Tools</Card>
        </Col>
      </Row>

      {/* Financial Goals */}
      <Row gutter={16} className="mt-6">
        <Col span={24}>
          <Card title="Financial Goals">Placeholder Financial Goals</Card>
        </Col>
      </Row>

      {/* Transaction History */}
      <Row gutter={16} className="mt-6">
        <Col span={24}>
          <Card title="Transaction History">
            Placeholder Transaction History
          </Card>
        </Col>
      </Row>

      {/* Alerts and Notifications */}
      <Row gutter={16} className="mt-6">
        <Col span={24}>
          <Card title="Alerts and Notifications">Placeholder Alerts</Card>
        </Col>
      </Row>

      {/* Tools and Calculators */}
      <Row gutter={16} className="mt-6">
        <Col span={24}>
          <Card title="Tools and Calculators">Placeholder Tools</Card>
        </Col>
      </Row>

      {/* Reports and Analytics */}
      <Row gutter={16} className="mt-6">
        <Col span={24}>
          <Card title="Reports and Analytics">Placeholder Reports</Card>
        </Col>
      </Row>

      {/* Settings and Preferences */}
      <Row gutter={16} className="mt-6">
        <Col span={24}>
          <Card title="Settings and Preferences">Placeholder Settings</Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardHome;

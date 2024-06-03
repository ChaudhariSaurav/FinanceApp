import React, { useState } from "react";
import { Layout, Menu, Modal } from "antd";
import {
  HomeOutlined,
  FileOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
  LineChartOutlined,
  LogoutOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import DashboardHome from "../pages/Home";
import TransactionPage from "../pages/Transaction";
import InstallmentTable from "../pages/Installment";

const { Header, Sider, Content } = Layout;

const Navbar = ({ customerId }) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("1");
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    setLogoutModalVisible(false);
  };

  const handleCancelLogout = () => {
    setLogoutModalVisible(false);
  };

  const handleMenuSelect = ({ key }) => {
    setSelectedMenuItem(key);
  };

  const renderContent = () => {
    switch (selectedMenuItem) {
      case "1":
        return (
          <div>
            <DashboardHome />
          </div>
        );
      case "2":
        return <div>Document Uploads Content</div>;
      case "3":
        return <div>Customer Details Content</div>;
      case "4":
        return (
          <div>
            <InstallmentTable />
          </div>
        );
      case "5":
        return <div>Loan Summary Content</div>;
      case "6":
        return (
          <div>
            <TransactionPage />
          </div>
        );
      case "7":
        return <div>Settings Content</div>;
      case "8":
        return <div>Logout Content</div>;
      default:
        return <div>Default Content</div>;
    }
  };

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        theme="dark"
        style={{ minHeight: "100vh" }}
      >
        <div className="p-4 text-white font-bold">JS GROUP'S</div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          onSelect={handleMenuSelect}
          style={{ marginTop: "15px" }}
        >
          <Menu.Item key="1" icon={<HomeOutlined />}>
            Home
          </Menu.Item>
          <Menu.Item key="2" icon={<FileOutlined />}>
            Document Uploads
          </Menu.Item>
          <Menu.Item key="3" icon={<UsergroupAddOutlined />}>
            Customer Details
          </Menu.Item>
          <Menu.Item key="4" icon={<LineChartOutlined />}>
            Installment
          </Menu.Item>
          <Menu.Item key="5" icon={<SettingOutlined />}>
            Loan Summary
          </Menu.Item>
          <Menu.Item key="6" icon={<WalletOutlined />}>
            Transaction
          </Menu.Item>
          <Menu.Item key="7" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
          <Menu.Item key="8" onClick={handleLogout} icon={<LogoutOutlined />}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="bg-gray-900 shadow-sm px-4 py-3 flex justify-between items-center">
          <div className="text-white font-bold"></div>
          <div className="text-white">
            {customerId && <p>Customer ID: {customerId}</p>}
          </div>
        </Header>
        <Content className="p-4">{renderContent()}</Content>
      </Layout>
      <Modal
        title="Confirm Logout"
        visible={logoutModalVisible}
        onOk={handleConfirmLogout}
        onCancel={handleCancelLogout}
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </Layout>
  );
};

export default Navbar;

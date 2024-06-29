import React, { useState } from "react";
import { Layout, Button, Drawer, Menu, Avatar, Modal } from "antd";
import {
  MenuOutlined,
  UserOutlined,
  CodeOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
const { Header } = Layout;

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const location = useLocation();

  const showDrawer = () => {
    setVisible(!visible);
  };

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    const customerId = localStorage.getItem("Customer Id");

    if (!token || !customerId) {
      localStorage.clear();
      window.location.href = "/auth/login";
    } else {
      setLogoutModalVisible(true);
    }
  };

  const handleConfirmLogout = () => {
    localStorage.clear();
    setLogoutModalVisible(false);
    window.location.href = "/auth/login";
  };

  const handleCancelLogout = () => {
    setLogoutModalVisible(false);
  };

  const gotoProfile = () => {
    window.location.href = "/profile";
  };

  // Extracting customerId from location.state or localStorage
  const { CustomerId } = location.state || {};
  const localStorageCustomerId = localStorage.getItem("Customer Id");

  return (
    <Layout className="shadow-md">
      <Header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white">
        <div className="flex items-center">
          <div className="mr-4">
            <img
              className="h-12"
              src="https://ik.imagekit.io/laxmifinance/adfinancelogo.png?updatedAt=1717456339448"
              alt="logo"
            />
          </div>
          <Menu mode="horizontal" className="hidden sm:flex">
            <Menu.Item key="Home">HOME</Menu.Item>
            <Menu.Item key="Transaction">Transaction</Menu.Item>
          </Menu>
        </div>

        <div className="flex items-center">
          <Button className="block lg:hidden" type="text" onClick={showDrawer}>
            <MenuOutlined />
          </Button>

          <Menu mode="horizontal" className="hidden lg:flex">
            <Menu.SubMenu
              title={
                <>
                  <Avatar icon={<UserOutlined />} />
                  <span className="ml-2">
                    {CustomerId
                      ? `Customer ID: ${CustomerId}`
                      : `Customer ID: ${localStorageCustomerId}`}
                  </span>
                </>
              }
            >
              <Menu.Item key="project">
                <CodeOutlined /> Projects
              </Menu.Item>
              <Menu.Item key="about-us" onClick={gotoProfile}>
                <UserOutlined /> Profile
              </Menu.Item>
              <Menu.Item key="log-out" onClick={handleLogout}>
                <LogoutOutlined /> Logout
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>

          <Drawer
            title="AD FINANCE"
            placement="right"
            closable
            onClose={showDrawer}
            visible={visible}
          >
            <Menu mode="inline">
              <Menu.Item key="Home">HOME</Menu.Item>
              <Menu.Item key="Transaction">Transaction</Menu.Item>
              <Menu.SubMenu
                title={
                  <>
                    <Avatar icon={<UserOutlined />} />
                    <span className="ml-2">
                      {CustomerId
                        ? `Customer ID: ${CustomerId}`
                        : `Customer ID: ${localStorageCustomerId}`}
                    </span>
                  </>
                }
              >
                <Menu.Item key="project">
                  <CodeOutlined /> Projects
                </Menu.Item>
                <Menu.Item key="about-us">
                  <UserOutlined /> Profile
                </Menu.Item>
                <Menu.Item key="log-out" onClick={handleLogout}>
                  <LogoutOutlined /> Logout
                </Menu.Item>
              </Menu.SubMenu>
            </Menu>
          </Drawer>
        </div>
      </Header>

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

import React, { useEffect, useState } from "react";
import { Layout, Button, Drawer, Menu, Avatar, Modal } from "antd";
import {
  MenuOutlined,
  UserOutlined,
  CodeOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  const showDrawer = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    setVisible(false);
  }, [location]);

  // Extracting customerId from location.state or localStorage
  const { customerId } = location.state || {};
  const localStorageCustomerId = localStorage.getItem("customerId");

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const handleConfirmLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    // Redirect to login page using window.location.href
    window.location.href = "/login";
    // Close the logout modal
    setLogoutModalVisible(false);
  };

  const handleCancelLogout = () => {
    setLogoutModalVisible(false);
  };

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  return (
    <nav className="navbar">
      <Layout>
        <Layout.Header className="nav-header">
          <div className="logo">
            <h3 className="brand-font">
              <img
                style={{ margin: "15px" }}
                src="https://ik.imagekit.io/laxmifinance/adfinancelogo.png?updatedAt=1717456339448"
                alt="logo"
              ></img>
            </h3>
          </div>
          <div className="navbar-menu">
            <div className="leftMenu">
              <Menu mode={"horizontal"}>
                <Menu.Item key="explore">Explore</Menu.Item>
                <Menu.Item key="features">Features</Menu.Item>
                <Menu.Item key="about">About Us</Menu.Item>
                <Menu.Item key="contact">Contact Us</Menu.Item>
              </Menu>
            </div>

            <Button className="menuButton" type="text" onClick={showDrawer}>
              <MenuOutlined />
            </Button>
            <div className="rightMenu">
              <Menu mode={"horizontal"}>
                <Menu.SubMenu
                  title={
                    <>
                      <Avatar icon={<UserOutlined />} />
                      <span className="username">
                        {customerId
                          ? `Customer ID: ${customerId}`
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
            </div>

            <Drawer
              title={"Brand Here"}
              placement="right"
              closable={true}
              onClose={showDrawer}
              visible={visible}
              style={{ zIndex: 99999 }}
            >
              <Menu mode={"inline"}>
                <Menu.Item key="explore">Explore</Menu.Item>
                <Menu.Item key="features">Features</Menu.Item>
                <Menu.Item key="about">About Us</Menu.Item>
                <Menu.Item key="contact">Contact Us</Menu.Item>
              </Menu>
              <Menu mode={"inline"}>
                <Menu.SubMenu
                  title={
                    <>
                      <Avatar icon={<UserOutlined />} />
                      <span className="username">
                        {customerId
                          ? `Customer ID: ${customerId}`
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
        </Layout.Header>
      </Layout>

      <Modal
        title="Confirm Logout"
        visible={logoutModalVisible}
        onOk={handleConfirmLogout}
        onCancel={handleCancelLogout}
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </nav>
  );
};

export default Navbar;

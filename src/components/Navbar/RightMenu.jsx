import React, { useState } from "react";
import { Menu, Avatar, Modal } from "antd";
import { UserOutlined, CodeOutlined, LogoutOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";

const RightMenu = ({ mode }) => {
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const location = useLocation();

  // Extracting customerId from location.state or localStorage
  const { customerId } = location.state || {};
  const localStorageCustomerId = localStorage.getItem("customerId");

  // Function to handle logout modal display
  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  // Function to confirm logout
  const handleConfirmLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");

    // Redirect to login page using window.location.href
    window.location.href = "/login";

    // Close the logout modal
    setLogoutModalVisible(false);
  };

  // Function to cancel logout
  const handleCancelLogout = () => {
    setLogoutModalVisible(false);
  };

  return (
    <Menu mode={mode}>
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

      <Modal
        title="Confirm Logout"
        visible={logoutModalVisible}
        onOk={handleConfirmLogout}
        onCancel={handleCancelLogout}
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </Menu>
  );
};

export default RightMenu;

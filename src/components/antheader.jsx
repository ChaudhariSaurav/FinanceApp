import React from "react";
import { Layout, Menu, Dropdown, Avatar, Button } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

const HeaderMenu = () => (
  <Dropdown
    overlay={
      <Menu>
        <Menu.Item key="profile">
          <ProfileOutlined />
          Profile
        </Menu.Item>
        <Menu.Item key="logout">
          <LogoutOutlined />
          Logout
        </Menu.Item>
      </Menu>
    }
    placement="bottomRight"
    arrow
  >
    <Button type="text" className="ant-dropdown-link">
      <Avatar icon={<UserOutlined />} />
    </Button>
  </Dropdown>
);

const AntHeader = () => (
  <Header className="header">
    <div className="logo" />
    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
      <Menu.Item key="1">Home</Menu.Item>
      <Menu.Item key="2">About</Menu.Item>
      <Menu.Item key="3">Contact</Menu.Item>
    </Menu>
    <div className="header-right">
      <HeaderMenu />
    </div>
  </Header>
);

export default AntHeader;

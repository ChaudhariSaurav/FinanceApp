// Profile.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Avatar, Space, Skeleton, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your backend API endpoint
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "https://your-backend-api.com/profile",
        );
        setUserData(response.data); // Assuming your API returns user data object
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Card>
        <Skeleton loading={loading} avatar active>
          <Card.Meta
            avatar={<Avatar icon={<UserOutlined />} />}
            title={
              <Text strong>{userData ? userData.name : "Loading..."}</Text>
            }
            description={
              <Space direction="vertical">
                <Text>Email: {userData ? userData.email : "Loading..."}</Text>
                {/* Add more fields as per your backend response */}
              </Space>
            }
          />
        </Skeleton>
      </Card>
    </div>
  );
};

export default Profile;
